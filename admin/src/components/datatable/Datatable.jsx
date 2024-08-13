import * as React from 'react';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Checkbox from '@mui/material/Checkbox';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { userRows } from "../../dataTableSource";
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import "./datatable.scss";
import { Link } from 'react-router-dom';
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";


import PropTypes from 'prop-types';



function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Datatable = () => {
  const [selected, setSelected] = useState([]);
  const [orderDirection, setOrderDirection] = useState('asc');
  const [valueToOrderBy, setValueToOrderBy] = useState('');
  const [rows, setRows] = useState([]);
  // const rows = userRows;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userRows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const createSortHandler = (property) => (event) => {
    const isAsc = valueToOrderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setValueToOrderBy(property);
  };

  userRows.sort((a, b) => {
    if (a[valueToOrderBy] < b[valueToOrderBy]) {
      return orderDirection === 'asc' ? -1 : 1;
    }
    if (a[valueToOrderBy] > b[valueToOrderBy]) {
      return orderDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleDelete = () => {
    const newRows = userRows.filter(row => !selected.includes(row.id));
    console.log('Deleting:', selected);
    setSelected([]);
    // Update the rows state if deleting from the client side
    setRows(newRows);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userRows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className='datatable'>
      <Paper sx={{ width: '100%', overflow: 'hidden' }} >
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Users
            </Typography>
          )}

          {selected.length > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < userRows.length}
                    checked={userRows.length > 0 && selected.length === userRows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all users' }}
                  />
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <TableSortLabel
                    active={valueToOrderBy === 'id'}
                    direction={valueToOrderBy === 'id' ? orderDirection : 'asc'}
                    onClick={createSortHandler('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <TableSortLabel
                    active={valueToOrderBy === 'username'}
                    direction={valueToOrderBy === 'username' ? orderDirection : 'asc'}
                    onClick={createSortHandler('username')}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <TableSortLabel
                    active={valueToOrderBy === 'email'}
                    direction={valueToOrderBy === 'email' ? orderDirection : 'asc'}
                    onClick={createSortHandler('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <TableSortLabel
                    active={valueToOrderBy === 'age'}
                    direction={valueToOrderBy === 'age' ? orderDirection : 'asc'}
                    onClick={createSortHandler('age')}
                  >
                    Age
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <TableSortLabel
                    active={valueToOrderBy === 'status'}
                    direction={valueToOrderBy === 'status' ? orderDirection : 'asc'}
                    onClick={createSortHandler('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? userRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : userRows
              ).map((row) => (
                <TableRow key={row.id}
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isSelected(row.id)}
                  tabIndex={-1}
                  selected={isSelected(row.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row.id)}
                      inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                    />
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="center">
                    {row.id}
                  </TableCell>
                  <TableCell style={{ width: 160 }} component="th" scope="row">
                    <div className='cellWithImg'>
                      <img src={row.img} alt={row.username} style={{ width: '30px', height: '30px', marginLeft: '10px', borderRadius: '50%' }} />
                      {row.username}
                    </div>
                  </TableCell>
                  <TableCell style={{ width: 160 }} >
                    {row.email}
                  </TableCell>
                  <TableCell align="center">
                    {row.age}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="center">
                    <div className={`cellWithStatus ${row.status}`}>
                      {row.status}
                    </div>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="center">
                    <div className="cellAction">
                      <div className="datatableEdit">Edit</div>
                      <div className="datatableDelete">Delete</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={7}
                  count={userRows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
      <button className="createUser">
        <Link to="/users/new" className="link">
          <PersonAddAltOutlined className="icon" />
          <span>
            New User
          </span>
        </Link>
      </button>
    </div>
  );
}

export default Datatable;
