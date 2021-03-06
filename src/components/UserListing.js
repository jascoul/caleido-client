import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

const styles = theme => ({
  formControl: {
    width: '100%',
  },
  table: {
      marginTop: theme.spacing.unit
  },
  fabButtonRight: {
      padding: theme.spacing.unit,
      display: 'flex',
      justifyContent: 'flex-end',
  },

});

@withStyles(styles)
class UserListing extends Component {

    handleRowClick = (record) => (event) => {
        this.props.history.push(`/record/user/${record.id}`);
        this.props.onChange({selected: record.id});

    }
    handleQueryChange = (event) => {
        this.props.onChange({query: event.target.value, offset: 0});
    }

    handlePageChange = (event, page) => {
        this.props.onChange({offset: page * (this.props.limit || 10)});
    }


    handleRowsPerPageChange = event => {
      this.props.onChange({offset: 0, limit: event.target.value});
    };

    componentWillMount(){
      this.props.changeAppHeader('Users');
        this.groupTypeLabels = {};

        for (const groupType of this.props.settings.type){
            this.groupTypeLabels[groupType.id] = groupType.label;
        }

      if (this.props.offset === undefined){
          // first run
          this.props.onChange({offset: 0});
      }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.query !== this.props.query ||
            nextProps.offset !== this.props.offset ||
            nextProps.limit !== this.props.limit){
            // a fetch is needed
          if (this.timeoutId){
              // a fetch is in already scheduled with a timeout, cancel it
              clearTimeout(this.timeoutId);
          }

          const fetchCallBack = () => {
              this.props.onFetch(nextProps.query,
                                 nextProps.filters,
                                 nextProps.offset,
                                 nextProps.limit);
          };
          if (nextProps.query !== this.props.query){
              // fetch after the timeout has passed
              this.timeoutId = setTimeout(fetchCallBack, 200);
          } else {
              fetchCallBack();
          }

      }
    }

    render(){
        const { classes, query, total, limit, offset, records } = this.props;
      return (
        <div>
        <Paper>
          <AppBar position="static" color="default">
            <Toolbar>
              <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor="search">{`Search Users`}</InputLabel>
              <Input
                id="search"
                type="text"
                value={query || ''}
                onChange={this.handleQueryChange}
                endAdornment={<InputAdornment position="end"><IconButton><SearchIcon /></IconButton></InputAdornment>}
              />
              </FormControl>
            </Toolbar>
          </AppBar>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>User Id</TableCell>
            <TableCell numeric>User Group</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(records || []).map(record => (
              <TableRow key={record.id}
                        selected={record.id === this.props.selected}
                        onClick={this.handleRowClick(record)}
                        style={{cursor:'pointer'}}
                        hover>
                <TableCell>{record.userid}</TableCell>
                <TableCell numeric>{this.groupTypeLabels[record.user_group]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={total || 0}
              rowsPerPage={limit || 10}
              page={(offset || 0) / (limit || 10)}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleRowsPerPageChange}>
          </TablePagination>
          </TableRow>
        </TableFooter>
      </Table>
      <div className={classes.fabButtonRight}>
        <Button variant="fab" color="primary" aria-label="add" onClick={() => {this.props.history.push('/record/user/add')}} >
          <AddIcon />
        </Button>
      </div>
      </Paper>
      </div>
      );

    }
}

export default UserListing;
