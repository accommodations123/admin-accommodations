import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TableContainer,
  InputBase,
  IconButton,
  CircularProgress,
  Backdrop,
  Container,
  AppBar,
  Toolbar,
  Badge,
  CssBaseline,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  Skeleton,
  Fab,
  Zoom,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
  Menu,
  Stack,
} from "@mui/material";
import {
  Search, // MUI icon
  Close, // MUI icon
  Refresh, // MUI icon
  Dashboard, // MUI icon
  Notifications, // MUI icon
  Person, // MUI icon
  FilterList, // MUI icon
  CalendarToday, // MUI icon
  LocationOn, // MUI icon
  People, // MUI icon
  Schedule, // MUI icon
  CheckCircle, // MUI icon
  ErrorOutline, // MUI icon
  Info, // MUI icon
  ChevronRight, // MUI icon
  Flight, // MUI icon
  Home, // MUI icon
  Settings, // MUI icon
  Logout, // MUI icon
  MoreVert, // MUI icon
  FlightTakeoff, // MUI icon
  FlightLand, // MUI icon
  AirlineSeatReclineNormal, // MUI icon
} from "@mui/icons-material";


import TripDetailsModal from "./TripDetailsModal";
import TravelDashboard from "./TravelDashboard";


/* =====================
   API CONFIG
===================== */
const BASE_URL = "https://accomodation.api.test.nextkinlife.live";
const TOKEN = localStorage.getItem("admin-auth");

/* =====================
   MAIN COMPONENT
===================== */
export default function TravelAdmin() {
  const theme = useTheme();
  const [trips, setTrips] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewTrip, setViewTrip] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    totalMatches: 0,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  /* =====================
     FETCH APIs
  ===================== */
  const fetchTrips = async () => {
    const res = await fetch(`${BASE_URL}/travel/admin/trips`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const json = await res.json();
    setTrips(json.results || []);
    return json.results || [];
  };

  const fetchMatches = async () => {
    const res = await fetch(`${BASE_URL}/travel/matches`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const json = await res.json();
    setMatches(json.results || []);
    return json.results || [];
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [tripsData, matchesData] = await Promise.all([fetchTrips(), fetchMatches()]);
      
      // Calculate stats
      setStats({
        totalTrips: tripsData.length,
        activeTrips: tripsData.filter(t => t.status === 'active').length,
        completedTrips: tripsData.filter(t => t.status === 'completed').length,
        totalMatches: matchesData.length,
      });
      
      setSnackbar({ open: true, message: 'Data refreshed successfully', severity: 'success' });
    } catch (err) {
      console.error("API Error", err);
      setSnackbar({ open: true, message: 'Failed to refresh data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* =====================
     SEARCH FILTER
  ===================== */
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const text =
        `${t.from_city} ${t.to_city} ${t.airline} ${t.host?.full_name}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [trips, search, statusFilter]);

  /* =====================
     MATCH COUNT
  ===================== */
  const matchCountByTrip = useMemo(() => {
    const map = {};
    matches.forEach((m) => {
      map[m.trip_id] = (map[m.trip_id] || 0) + 1;
    });
    return map;
  }, [matches]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <CssBaseline />

       <TravelDashboard
    stats={stats}
    trips={trips}
    matches={matches}
  />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* ================= DASHBOARD COMPONENT ================= */}
        <Dashboard stats={stats} trips={trips} matches={matches} />

        {/* ================= TABS ================= */}
        <Card elevation={0} sx={{ borderRadius: 3, mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ px: 2 }}
            >
              <Tab label="All Trips" icon={<Flight sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="Active Trips" icon={<Schedule sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="Completed Trips" icon={<CheckCircle sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="Recent Matches" icon={<People sx={{ fontSize: 18 }} />} iconPosition="start" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* ================= SEARCH & FILTER ================= */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ display: "flex", alignItems: "center", px: 2, py: 1.5, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                  <Search sx={{ fontSize: 18, color: '#888' }} />
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search by city, airline, traveler..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <IconButton onClick={() => setSearch("")} size="small">
                      <Close sx={{ fontSize: 16, color: '#888' }} />
                    </IconButton>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                      startAdornment={<FilterList sx={{ fontSize: 16, mr: 1 }} />}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    startIcon={<Refresh />}
                    variant="outlined"
                    onClick={fetchAll}
                    sx={{ borderRadius: 2 }}
                  >
                    Refresh
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* ================= TABLE ================= */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Traveler</TableCell>
                    <TableCell>Route</TableCell>
                    <TableCell>Flight</TableCell>
                    <TableCell>Departure</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Matches</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton animation="wave" /></TableCell>
                        <TableCell><Skeleton animation="wave" /></TableCell>
                        <TableCell><Skeleton animation="wave" /></TableCell>
                        <TableCell><Skeleton animation="wave" /></TableCell>
                        <TableCell><Skeleton animation="wave" /></TableCell>
                        <TableCell><Skeleton animation="wave" /></TableCell>
                        <TableCell><Skeleton animation="wave" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredTrips.map((t) => (
                      <TableRow key={t.id} hover sx={{ '&:hover': { bgcolor: alpha('#1976d2', 0.04) } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, width: 36, height: 36, bgcolor: '#1976d2' }}>
                              {t.host?.full_name?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600}>
                                {t.host?.full_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t.host?.User?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FlightTakeoff sx={{ fontSize: 16, color: '#888', mr: 0.5 }} />
                                <Typography variant="body2" fontWeight={500}>
                                  {t.from_city}, {t.from_country}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <FlightLand sx={{ fontSize: 16, color: '#888', mr: 0.5 }} />
                                <Typography variant="body2">
                                  {t.to_city}, {t.to_country}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AirlineSeatReclineNormal sx={{ fontSize: 16, color: '#888', mr: 0.5 }} />
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {t.airline}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t.flight_number}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ fontSize: 16, color: '#888', mr: 0.5 }} />
                            <Box>
                              <Typography variant="body2">
                                {t.travel_date}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t.departure_time}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip 
                            label={t.status.toUpperCase()} 
                            color={
                              t.status === 'active' ? 'success' : 
                              t.status === 'completed' ? 'default' : 
                              'warning'
                            } 
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={matchCountByTrip[t.id] || 0}
                            color={
                              matchCountByTrip[t.id] > 0 ? "primary" : "default"
                            }
                            size="small"
                            variant="outlined"
                            icon={<People sx={{ fontSize: 14 }} />}
                          />
                        </TableCell>

                        <TableCell>
                          <Tooltip title="View Details">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setViewTrip(t)}
                              sx={{ borderRadius: 2 }}
                              startIcon={<Info sx={{ fontSize: 16 }} />}
                            >
                              View
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {!loading && !filteredTrips.length && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <ErrorOutline sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography color="text.secondary">
                    No trips found matching your criteria
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={() => { setSearch(''); setStatusFilter('all'); }}>
                    Clear filters
                  </Button>
                </Box>
              )}
            </TableContainer>
          </Box>
        </Card>
      </Container>

      {/* ================= TRIP DETAILS MODAL ================= */}
      <TripDetailsModal
        open={Boolean(viewTrip)}
        trip={viewTrip}
        matches={matches}
        onClose={() => setViewTrip(null)}
      />

      {/* ================= FLOATING ACTION BUTTON ================= */}
      <Zoom in={true} timeout={300} style={{ transitionDelay: '300ms' }}>
        <Fab
          color="primary"
          aria-label="refresh"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={fetchAll}
        >
          <Refresh />
        </Fab>
      </Zoom>

      {/* ================= BACKDROP ================= */}
      <Backdrop open={loading} sx={{ zIndex: 9999 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading data...
          </Typography>
        </Box>
      </Backdrop>

      {/* ================= SNACKBAR ================= */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}