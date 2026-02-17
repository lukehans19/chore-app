import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
} from '@mui/material';
import type { Recurrence } from '../types';

interface Props {
  value: Recurrence;
  onChange: (r: Recurrence) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th'];

export default function RecurrenceEditor({ value, onChange }: Props) {
  const update = (partial: Partial<Recurrence>) => {
    onChange({ ...value, ...partial });
  };

  const toggleDay = (day: number) => {
    const days = value.daysOfWeek.includes(day)
      ? value.daysOfWeek.filter((d) => d !== day)
      : [...value.daysOfWeek, day].sort();
    update({ daysOfWeek: days });
  };

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography variant="subtitle2" gutterBottom>
        Schedule
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Frequency</InputLabel>
          <Select
            value={value.type}
            label="Frequency"
            onChange={(e) => update({ type: e.target.value as Recurrence['type'] })}
          >
            <MenuItem value="once">One-time</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="biweekly">Biweekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="custom">Custom (every N days)</MenuItem>
          </Select>
        </FormControl>

        {(value.type === 'daily' || value.type === 'weekly' || value.type === 'monthly' || value.type === 'custom') && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Every</Typography>
            <TextField
              type="number"
              size="small"
              value={value.interval}
              onChange={(e) => update({ interval: parseInt(e.target.value) || 1 })}
              slotProps={{ htmlInput: { min: 1 } }}
              sx={{ width: 70 }}
            />
            <Typography variant="body2">
              {value.type === 'daily' || value.type === 'custom'
                ? 'day(s)'
                : value.type === 'weekly'
                  ? 'week(s)'
                  : 'month(s)'}
            </Typography>
          </Box>
        )}
      </Box>

      {(value.type === 'weekly' || value.type === 'biweekly') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Days of Week
          </Typography>
          <ToggleButtonGroup size="small">
            {DAY_NAMES.map((name, i) => (
              <ToggleButton
                key={i}
                value={i}
                selected={value.daysOfWeek.includes(i)}
                onClick={() => toggleDay(i)}
                sx={{ px: 1.5 }}
              >
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}

      {value.type === 'monthly' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Monthly Pattern
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Pattern</InputLabel>
              <Select
                value={value.monthlyPattern || 'dayOfMonth'}
                label="Pattern"
                onChange={(e) => update({ monthlyPattern: e.target.value as Recurrence['monthlyPattern'] })}
              >
                <MenuItem value="dayOfMonth">Same day of month</MenuItem>
                <MenuItem value="nthWeekday">Nth weekday</MenuItem>
                <MenuItem value="lastWeekday">Last weekday of month</MenuItem>
              </Select>
            </FormControl>

            {(value.monthlyPattern === 'nthWeekday') && (
              <>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <InputLabel>Which</InputLabel>
                  <Select
                    value={value.nthWeek ?? 1}
                    label="Which"
                    onChange={(e) => update({ nthWeek: Number(e.target.value) })}
                  >
                    {ORDINALS.map((label, i) => (
                      <MenuItem key={i} value={i + 1}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={value.weekday ?? 0}
                    label="Day"
                    onChange={(e) => update({ weekday: Number(e.target.value) })}
                  >
                    {DAY_NAMES.map((name, i) => (
                      <MenuItem key={i} value={i}>{name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {value.monthlyPattern === 'lastWeekday' && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  value={value.weekday ?? 0}
                  label="Day"
                  onChange={(e) => update({ weekday: Number(e.target.value) })}
                >
                  {DAY_NAMES.map((name, i) => (
                    <MenuItem key={i} value={i}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          type="date"
          label="Start Date"
          size="small"
          value={value.startDate}
          onChange={(e) => update({ startDate: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          type="date"
          label="End Date (optional)"
          size="small"
          value={value.endDate || ''}
          onChange={(e) => update({ endDate: e.target.value || null })}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
    </Box>
  );
}
