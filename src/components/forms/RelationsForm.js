import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Field, Fields, FieldArray } from 'redux-form'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LanguageIcon from '@material-ui/icons/Language';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { mappedTextField, mappedSelect, mappedRelationField } from '../widgets/mapping.js';
import styles from './formStyles.js';


@withStyles(styles, { withTheme: true })
class RelationsForm extends React.Component {
    state = {
        limit: 5,
        offset: 0,
        total: 0,
        selected: null,
        query: '',
        targetWorkTypeFilter: 'journal',
    };


    addRelation = (position=null) => {
        // note: this.relationFields is set in the renderRelations
        // method, we should figure how to get use the global arrayPush redux-form action
        const newRelation = {type: 'isPartOf'};
        let selected = position
        if (position === null){
            this.relationFields.push(newRelation);
            selected = this.relationFields.length
        } else {
            this.relationFields.insert(position, newRelation);
        }
        const total = this.relationFields.length;
        this.setState({selected: selected,
                       total: total,
                       query: '',
                       offset: Math.floor(selected/this.state.limit) * this.state.limit});
    }

    getErrorCount(errors) {
        if (!errors || !errors.relations){
            return 0
        }
        let errorCount = 0;
        for (const error of Object.values(errors.relations)){
          for (const field of ['person_id', 'role', 'start_date', 'end_date', 'location', 'description']){
              if (error[field] !== undefined){
                errorCount += 1;
              }
          }
        }
        return errorCount
    }
    handleRowClick = (index) => (event) => {
        this.setState({selected: index});
    }

    calcFilteredTotal = (query) =>{
        // calculate the new total fields after filtering
        // this is double work, but it needs to be done before
        // rendering the table rows to set the total pagination count
        // correctly
        let filteredTotal = 0;
        this.relationFields.getAll().map(relation => {
            if (query && relation._target_name.toLowerCase().indexOf(query) === -1){
                return null
            }
            filteredTotal += 1;
            return null;
        })
        return filteredTotal
    }

    handleTargetWorkTypeFilterChange = event => {
        this.setState({targetWorkTypeFilter: event.target.value})
    }

    handleQueryChange = event => {
        // calc new total value
        const query = event.target.value;
        this.setState({offset: 0,
                       selected: null,
                       total: this.calcFilteredTotal(query),
                       query});
    }

    handlePageChange = (event, page) => {
        this.setState({offset: page * this.state.limit})
    }


    handleRowsPerPageChange = event => {
        this.setState({offset: 0, limit: event.target.value});
    };

    renderForm = (fields, field, index, error) => {
        const { classes, relationOptions, typeOptions } = this.props;
        const { targetWorkTypeFilter } = this.state;
        const style = {}
        if (error !== null){
            style.border = '2px dotted red';
        }
        return (
           <TableRow key={index} selected={true} style={style}>

            <TableCell colSpan="3" style={{padding:24}}>
            <Card>
            <CardContent>
            <div style={{display:'flex'}}>
             <Field name={`${field}.type`}
                    component={mappedSelect}
                    options={relationOptions}
                    label="Relation Type"
                    className={classes.dateField}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
            <FormControl className={classes.formControlSelect}>
              <InputLabel htmlFor="target-work-type-filter">Work Type</InputLabel>
                <Select  value={targetWorkTypeFilter}
                         onChange={this.handleTargetWorkTypeFilterChange}
                         inputProps={{id: 'target-work-type-filter'}}>
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {typeOptions.map(type => (
                    <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
             <span className={classes.gutter}> </span>
             <Fields names={[`${field}.target_id`, `${field}._target_name`]}
                    component={mappedRelationField}
                    placeholder="Work"
                    kind="work"
                    filters={{type:targetWorkTypeFilter}}
                    className={classes.flex} />
            </div>
            <div className={classes.formFieldRow}>
             <Field name={`${field}.volume`}
                    component={mappedTextField}
                    label="Volume"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
             <Field name={`${field}.issue`}
                    component={mappedTextField}
                    label="Issue"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
             <Field name={`${field}.number`}
                    component={mappedTextField}
                    label="(Report) Number"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
            </div>
            <div className={classes.formFieldRow}>
            <Field name={`${field}.starting`}
                    component={mappedTextField}
                    label="Starting (Page)"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
             <Field name={`${field}.ending`}
                    component={mappedTextField}
                    label="Ending (Page)"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
             <Field name={`${field}.total`}
                    component={mappedTextField}
                    label="Total (Page)"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
            </div>
            <div className={classes.formFieldRow}>
             <Field name={`${field}.description`}
                    component={mappedTextField}
                    label="Description"
                    multiline
                    rowsMax="4"
                    className={classes.flex}/>
            </div>
            <div className={classes.formFieldRow}>
             <Field name={`${field}.location`}
                    component={mappedTextField}
                    label="Location"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
             <Field name={`${field}.start_date`}
                    component={mappedTextField}
                    label="Start Date"
                    type="date"
                    className={classes.dateField}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
             <Field name={`${field}.end_date`}
                    component={mappedTextField}
                    label="End Date"
                    type="date"
                    className={classes.dateField}
                    InputLabelProps={{shrink: true}}/>
            </div>
            </CardContent>
            <CardActions>
              <div className={classes.fabButtonRight}>
              <Button color="primary" aria-label="delete" onClick={() => this.addRelation(index)} >
                <AddIcon /> Insert Relation
              </Button>
              <Button color="primary" aria-label="delete" onClick={() => fields.remove(index)} >
                <DeleteIcon /> Remove Relation
              </Button>
              </div>
             </CardActions>
            </Card>
            </TableCell>
           </TableRow>);

    }

    renderRelations = (props) => {
        const { fields, offset, limit, selected, query, errors } = props;
        const { classes } = this.props;
        this.relationFields = fields;
        let errorMessages = {}
        if (errors !== null){
            errorMessages = errors.relations;
        }
        let filteredIndex = -1;
        const filteredFields = [];
        fields.forEach(
            (field, index) => {
                let values = fields.get(index)
                if (query && values._target_name.toLowerCase().indexOf(query) === -1){
                    return
                }
                filteredIndex += 1;
                if (filteredIndex >= offset && filteredIndex < offset + limit){
                    let style = {cursor:'pointer'};
                    if (errorMessages[index] !== undefined){
                        style.border = '2px dotted red';
                    }
                    let frag = (<TableRow key={index}
                                          selected={index === selected}
                                          onClick={this.handleRowClick(index)}
                                          style={style}
                                          hover>
                        <TableCell>
                        <IconButton to={`/record/work/${values.target_id}`}
                                    onClick={(e) => (e.stopPropagation())}
                                    className={classes.listingRelationIconLink}
                                    component={Link}><OpenInNewIcon/></IconButton>
                        {values._target_name}
                        </TableCell>
                        <TableCell style={{whiteSpace: 'nowrap'}}>{values.type}</TableCell>
                        <TableCell>{values._target_type}</TableCell>
                        </TableRow>);
                    if (index === this.state.selected){
                        frag = this.renderForm(fields, field, index, errorMessages[index] || null)
                    }
                    filteredFields.push(frag);
                }
            });
        return filteredFields
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextProps.open === false &&
            nextProps.open === this.props.open &&
            (this.props.formValues || []).length === (nextProps.formValues || []).length){
            return false
        }
        return true;
    }

    render(){
        const { classes, onAccordionClicked, open, errors, formValues } = this.props;
        const errorCount = this.getErrorCount(errors);
        const { limit, offset, selected, total, query, targetWorkTypeFilter } = this.state;
        const relationCount = (formValues || []).length;
        return (
          <ExpansionPanel expanded={open} onChange={onAccordionClicked} CollapseProps={{ unmountOnExit: true }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <ListItemIcon>{ errorCount > 0 ? <Badge badgeContent={errorCount} color="primary" classes={{colorPrimary: classes.errorBGColor}}><LanguageIcon /></Badge>: <LanguageIcon />}</ListItemIcon>
              <ListItemText primary="Relations" />
            {relationCount?<Chip label={relationCount} align="right" key={relationCount}/>:null}
            <div/>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.editorPanel}>
          <Card className={classes.editorCard}>
          <CardContent style={{padding: '16px 0px 0px 0px'}}>
          {relationCount > 5?
          <AppBar position="static" color="default">
            <Toolbar>
              <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor="search">{`Filter Relations`}</InputLabel>
              <Input
                id="search"
                type="text"
                value={query || ''}
                onChange={this.handleQueryChange}
                endAdornment={<InputAdornment position="end"><IconButton><SearchIcon /></IconButton></InputAdornment>}
              />
        </FormControl>
            </Toolbar>
          </AppBar>:null}
      <Table className={classes.table}>
        {relationCount > 0?
        <TableHead>
          <TableRow>
            <TableCell>Work</TableCell>
            <TableCell>Relation</TableCell>
            <TableCell className={classes.dateField}>Work Type</TableCell>
          </TableRow>
        </TableHead>:null}
        <TableBody>
          <FieldArray name="relations"
                      component={this.renderRelations}
                      offset={offset}
                      limit={limit}
                      selected={selected}
                      query={query}
                      targetWorkTypeFilter={targetWorkTypeFilter}
                      errors={errors} />
          </TableBody>
        {relationCount > 5?
        <TableFooter>
          <TableRow>
            <TablePagination
              count={total || relationCount}
              rowsPerPage={limit}
              page={(offset) / (limit)}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleRowsPerPageChange}>
          </TablePagination>
          </TableRow>
        </TableFooter>:null}
      </Table>

        </CardContent>
          <CardActions>
          <Button type="submit" color="primary">
          Update
          </Button>
              <div className={classes.fabButtonRight}>
              <Button color="primary" aria-label="add" onClick={() => this.addRelation(null)} >
                <AddIcon /> Add Relation
              </Button>
              </div>

          </CardActions>
          </Card>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        );
    }
}
export default RelationsForm;
