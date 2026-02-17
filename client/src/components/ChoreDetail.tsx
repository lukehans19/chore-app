import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { CalendarEvent, Member, Completion } from '../types';
import { addCompletion, removeCompletion, getCompletions } from '../data/completions';

interface Props {
  event: CalendarEvent;
  members: Member[];
  onClose: () => void;
  onComplete: () => void;
}

export default function ChoreDetail({ event, members, onClose, onComplete }: Props) {
  const [completedBy, setCompletedBy] = useState(members[0]?.id || '');
  const [history, setHistory] = useState<Completion[]>([]);

  useEffect(() => {
    setHistory(getCompletions(event.choreId));
  }, [event.choreId]);

  const handleMarkComplete = () => {
    if (!completedBy) return;
    addCompletion({
      choreId: event.choreId,
      completedBy,
      scheduledDate: event.date,
    });
    onComplete();
  };

  const handleUndoCompletion = () => {
    if (!event.completionId) return;
    removeCompletion(event.completionId);
    onComplete();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {event.title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" gutterBottom>
          <strong>Date:</strong> {event.date}
        </Typography>
        {event.description && (
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> {event.description}
          </Typography>
        )}
        <Typography variant="body2" gutterBottom>
          <strong>Assigned to:</strong> {event.assigneeName || 'Unassigned'}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <strong>Status: </strong>
          {event.isCompleted ? (
            <Chip label={`Completed by ${event.completedBy}`} color="success" size="small" />
          ) : (
            <Chip label="Pending" color="warning" size="small" />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {!event.isCompleted ? (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Mark as Complete
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Completed by</InputLabel>
                <Select
                  value={completedBy}
                  label="Completed by"
                  onChange={(e) => setCompletedBy(e.target.value)}
                >
                  {members.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleMarkComplete}
                disabled={!completedBy}
              >
                Mark Complete
              </Button>
            </Box>
          </Box>
        ) : (
          <Button variant="outlined" color="secondary" onClick={handleUndoCompletion}>
            Undo Completion
          </Button>
        )}

        {history.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Completion History
            </Typography>
            <List dense disablePadding>
              {history.map((h) => (
                <ListItem key={h.id} disableGutters>
                  <ListItemText
                    primary={h.scheduledDate}
                    secondary={`Completed by ${h.completedByName} on ${new Date(h.completedAt).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
