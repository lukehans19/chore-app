import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { Member } from '../types';
import { addMember, removeMember } from '../data/members';

interface Props {
  members: Member[];
  onDataChange: () => void;
}

const PRESET_COLORS = ['#4A90D9', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#3498DB'];

export default function MembersTab({ members, onDataChange }: Props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMember(name.trim(), color);
    setName('');
    setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    onDataChange();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this team member? Their chores will become unassigned.')) return;
    removeMember(id);
    onDataChange();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Team Members</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ width: 200 }}
          />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {PRESET_COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => setColor(c)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: c,
                  cursor: 'pointer',
                  border: color === c ? '2px solid #333' : '2px solid transparent',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.1s',
                }}
              />
            ))}
          </Box>
          <Button type="submit" variant="contained" startIcon={<PersonAddIcon />}>
            Add Member
          </Button>
        </Box>
      </Paper>

      {members.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 5 }}>
          No team members yet. Add someone to get started!
        </Typography>
      ) : (
        <Paper>
          <List>
            {members.map((m) => (
              <ListItem key={m.id}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: m.color, width: 32, height: 32 }}>
                    {m.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={m.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="error" onClick={() => handleDelete(m.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
