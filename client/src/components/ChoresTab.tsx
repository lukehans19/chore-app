import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Chore, Member } from '../types';
import { removeChore } from '../data/chores';
import ChoreForm from './ChoreForm';

interface Props {
  chores: Chore[];
  members: Member[];
  onDataChange: () => void;
}

const RECURRENCE_LABELS: Record<string, string> = {
  once: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  monthly: 'Monthly',
  custom: 'Custom',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ChoresTab({ chores, members, onDataChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Chore | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm('Delete this chore and all its completions?')) return;
    removeChore(id);
    onDataChange();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    onDataChange();
  };

  const getMemberName = (id: string | null) => {
    if (!id) return 'Unassigned';
    return members.find((m) => m.id === id)?.name || 'Unknown';
  };

  const formatRecurrence = (chore: Chore) => {
    const r = chore.recurrence;
    let label = RECURRENCE_LABELS[r.type] || r.type;
    if (r.interval > 1 && r.type !== 'once' && r.type !== 'biweekly') {
      label = `Every ${r.interval} ${r.type === 'daily' || r.type === 'custom' ? 'days' : r.type === 'weekly' ? 'weeks' : 'months'}`;
    }
    if ((r.type === 'weekly' || r.type === 'biweekly') && r.daysOfWeek.length > 0) {
      label += ` (${r.daysOfWeek.map((d) => DAY_NAMES[d]).join(', ')})`;
    }
    if (r.type === 'monthly' && r.monthlyPattern === 'nthWeekday' && r.nthWeek && r.weekday != null) {
      const ordinals = ['1st', '2nd', '3rd', '4th', '5th'];
      label += ` (${ordinals[r.nthWeek - 1]} ${DAY_NAMES[r.weekday]})`;
    }
    if (r.type === 'monthly' && r.monthlyPattern === 'lastWeekday' && r.weekday != null) {
      label += ` (Last ${DAY_NAMES[r.weekday]})`;
    }
    return label;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Chores</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditing(null); setShowForm(true); }}
        >
          Add Chore
        </Button>
      </Box>

      {(showForm || editing) && (
        <ChoreForm
          members={members}
          editingChore={editing}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {chores.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 5 }}>
          No chores yet. Add one to get started!
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Assigned To</strong></TableCell>
                <TableCell><strong>Schedule</strong></TableCell>
                <TableCell><strong>Start Date</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chores.map((chore) => (
                <TableRow key={chore.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{chore.title}</Typography>
                    {chore.description && (
                      <Typography variant="caption" color="text.secondary">{chore.description}</Typography>
                    )}
                  </TableCell>
                  <TableCell>{getMemberName(chore.assigneeId)}</TableCell>
                  <TableCell>{formatRecurrence(chore)}</TableCell>
                  <TableCell>{chore.recurrence.startDate}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => { setEditing(chore); setShowForm(false); }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(chore.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
