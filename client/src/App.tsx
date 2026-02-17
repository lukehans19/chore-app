import { useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  Box,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import { getMembers } from './data/members';
import { getChores } from './data/chores';
import type { Member, Chore } from './types';
import CalendarView from './components/CalendarView';
import ChoresTab from './components/ChoresTab';
import MembersTab from './components/MembersTab';

export default function App() {
  const [tab, setTab] = useState(0);
  const [members, setMembers] = useState<Member[]>(() => getMembers());
  const [chores, setChores] = useState<Chore[]>(() => getChores());

  const loadData = useCallback(() => {
    setMembers(getMembers());
    setChores(getChores());
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Office Chore Manager
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: '#fff' } } }}
          >
            <Tab icon={<CalendarMonthIcon />} label="Calendar" iconPosition="start" />
            <Tab icon={<AssignmentIcon />} label="Chores" iconPosition="start" />
            <Tab icon={<GroupIcon />} label="Team" iconPosition="start" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {tab === 0 && <CalendarView members={members} onDataChange={loadData} />}
        {tab === 1 && <ChoresTab chores={chores} members={members} onDataChange={loadData} />}
        {tab === 2 && <MembersTab members={members} onDataChange={loadData} />}
      </Container>
    </Box>
  );
}
