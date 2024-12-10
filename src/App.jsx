import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  Alert,
} from "@mui/material";
import {
  LocalShipping,
  FilterList,
  AddCircle,
  CheckCircle,
  HourglassEmpty,
  DirectionsBoat,
  Assignment,
  Description,
  AccessTime,
  LocationOn,
  DateRange,
} from "@mui/icons-material";

const initialCargoList = [
  {
    id: "CARGO001",
    name: "Строительные материалы",
    status: "В пути",
    origin: "Москва",
    destination: "Казань",
    departureDate: "2024-11-24",
  },
  {
    id: "CARGO002",
    name: "Хрупкий груз",
    status: "Ожидает отправки",
    origin: "Санкт-Петербург",
    destination: "Екатеринбург",
    departureDate: "2024-11-26",
  },
];

const cities = ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург"];
const statuses = [
  { label: "Ожидает отправки", icon: <HourglassEmpty fontSize="small" /> },
  { label: "В пути", icon: <DirectionsBoat fontSize="small" /> },
  { label: "Доставлен", icon: <CheckCircle fontSize="small" /> },
];

function App() {
  const [cargoList, setCargoList] = useState(initialCargoList);
  const [newCargo, setNewCargo] = useState({
    name: "",
    origin: "",
    destination: "",
    departureDate: "",
    status: "Ожидает отправки",
  });
  const [filter, setFilter] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });

  const handleInputChange = (e) => {
    setNewCargo({ ...newCargo, [e.target.name]: e.target.value });
  };

  const handleAddCargo = () => {
    if (
      !newCargo.name ||
      !newCargo.origin ||
      !newCargo.destination ||
      !newCargo.departureDate
    ) {
      showAlert("Заполните все поля!", "error");
      return;
    }
    const newId = `CARGO${(cargoList.length + 1).toString().padStart(3, "0")}`;
    setCargoList([...cargoList, { id: newId, ...newCargo }]);
    showAlert("Груз успешно добавлен!", "success");
    setNewCargo({
      name: "",
      origin: "",
      destination: "",
      departureDate: "",
      status: "Ожидает отправки",
    });
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedList = cargoList.map((cargo) => {
      if (cargo.id === id) {
        if (
          newStatus === "Доставлен" &&
          new Date(cargo.departureDate) > new Date()
        ) {
          showAlert("Груз с будущей датой не может быть доставлен!", "error");
          return cargo;
        }
        return { ...cargo, status: newStatus };
      }
      return cargo;
    });
    setCargoList(updatedList);
    showAlert("Статус обновлен!", "info");
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const showAlert = (message, severity) => {
    setAlert({ show: true, message, severity });
    setTimeout(
      () => setAlert({ show: false, message: "", severity: "" }),
      3000
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ожидает отправки":
        return "bg-yellow-100 text-yellow-800";
      case "В пути":
        return "bg-blue-100 text-blue-800";
      case "Доставлен":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  const filteredCargoList = filter
    ? cargoList.filter((cargo) => cargo.status === filter)
    : cargoList;

  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">

      <div className="container1">
        <div className="flex items-center justify-between pb-[40px] pt-[25px]">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <LocalShipping fontSize="large" /> Отслеживание грузов
          </h1>
          <Button
            variant="contained"
            color="error"
            startIcon={<FilterList />}
            onClick={() => handleFilterChange("")}
          >
            Сбросить фильтр
          </Button>
        </div>

        <div className="space-y-4 bg-white p-4 rounded-lg shadow mb-[30px]">
          <h2 className="text-lg font-semibold text-gray-700">
            Добавить новый груз
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Название груза"
              name="name"
              value={newCargo.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              select
              label="Пункт отправления"
              name="origin"
              value={newCargo.origin}
              onChange={handleInputChange}
              fullWidth
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Пункт назначения"
              name="destination"
              value={newCargo.destination}
              onChange={handleInputChange}
              fullWidth
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Дата отправления"
              name="departureDate"
              type="date"
              value={newCargo.departureDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircle />}
            onClick={handleAddCargo}
          >
            Добавить
          </Button>
        </div>

        <div className="flex space-x-4 mb-[27px]">
          {statuses.map((status) => (
            <Button
              key={status.label}
              variant={filter === status.label ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleFilterChange(status.label)}
            >
              {status.icon} {status.label}
            </Button>
          ))}
        </div>

        <TableContainer component={Paper} className="rounded-lg shadow">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Assignment fontSize="small" /> Номер
                </TableCell>
                <TableCell>
                  <Description fontSize="small" /> Название
                </TableCell>
                <TableCell>
                  <AccessTime fontSize="small" /> Статус
                </TableCell>
                <TableCell>
                  <LocationOn fontSize="small" /> Откуда
                </TableCell>
                <TableCell>
                  <LocationOn fontSize="small" /> Куда
                </TableCell>
                <TableCell>
                  <DateRange fontSize="small" /> Дата отправления
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCargoList.map((cargo) => (
                <TableRow key={cargo.id} className="hover:bg-gray-100">
                  <TableCell>{cargo.id}</TableCell>
                  <TableCell>{cargo.name}</TableCell>
                  <TableCell>
                    <Select
                      value={cargo.status}
                      onChange={(e) =>
                        handleStatusChange(cargo.id, e.target.value)
                      }
                      className={`rounded ${getStatusColor(cargo.status)}`}
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status.label} value={status.label}>
                          {status.icon} {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>{cargo.origin}</TableCell>
                  <TableCell>{cargo.destination}</TableCell>
                  <TableCell>{cargo.departureDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {alert.show && (
          <div
            className={`fixed bottom-4 right-4 transition-opacity duration-500 ${
              alert.show ? "opacity-100" : "opacity-0"
            }`}
          >
            <Alert severity={alert.severity} variant="filled">
              {alert.message}
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
