import { useState } from 'react';
import { format } from 'date-fns';
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import type { Chore, Member, Recurrence } from '../types';
import { addChore, editChore } from '../data/chores';
import RecurrenceEditor from './RecurrenceEditor';

interface Props {
  members: Member[];
  editingChore?: Chore | null;
  onSaved: () => void;
  onCancel: () => void;
}

const defaultRecurrence = (): Recurrence => ({
  type: 'once',
  interval: 1,
  daysOfWeek: [],
  startDate: format(new Date(), 'yyyy-MM-dd'),
  endDate: null,
});

export default function ChoreForm({ members, editingChore, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(editingChore?.title || '');
  const [description, setDescription] = useState(editingChore?.description || '');
  const [assigneeId, setAssigneeId] = useState<string>(editingChore?.assigneeId || '');
  const [recurrence, setRecurrence] = useState<Recurrence>(
    editingChore?.recurrence || defaultRecurrence(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data = {
      title: title.trim(),
      description: description.trim(),
      assigneeId: assigneeId || null,
      recurrence,
    };

    if (editingChore) {
      editChore(editingChore.id, data);
    } else {
      addChore(data);
    }
    onSaved();
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {editingChore ? 'Edit Chore' : 'Add Chore'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={2}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />

        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assign to</InputLabel>
          <Select
            value={assigneeId}
            label="Assign to"
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {members.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <RecurrenceEditor value={recurrence} onChange={setRecurrence} />

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button type="submit" variant="contained">
            {editingChore ? 'Update' : 'Add Chore'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
