import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Field, FieldArray } from 'redux-form'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';


import { mappedTextField, mappedSelect } from '../widgets/mapping.js';
import styles from './formStyles.js';

@withStyles(styles, { withTheme: true })
class MeasuresForm extends React.Component {


    getErrorCount() {
        if (!this.props.errors || !this.props.errors.measures){
            return 0
        }
        let errorCount = 0;
        for (const error of Object.values(this.props.errors.measures)){
          for (const field of ['type', 'value']){
              if (error[field] !== undefined){
                errorCount += 1;
              }
          }
        }
        return errorCount
    }

    renderMeasures = (measures) => {
        const { classes, typeOptions } = this.props;
        return (<div>
              {measures.fields.map((measure, measureIndex) =>
           <div key={measureIndex} className={classes.formItem}>
             <Field name={`${measure}.type`} component={mappedSelect} options={typeOptions} label="Type" className={classes.measureTypeSelect}/>
             <span className={classes.gutter}> </span>
             <Field name={`${measure}.value`} component={mappedTextField} label="Value (identifier)" className={classes.flex}/>
             <IconButton aria-label="Delete" onClick={() => measures.fields.remove(measureIndex)}><DeleteIcon /></IconButton>
           </div>)}
              <div className={classes.fabButtonRight}>
              <Button color="primary" aria-label="add" onClick={() => measures.fields.push({})} >
                <AddIcon /> Add Measure
              </Button>
              </div>
            </div>)

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
        const { classes, onAccordionClicked, open, formValues } = this.props;
        const errorCount = this.getErrorCount();
        const measureCount = (formValues || []).length;
        return (
          <ExpansionPanel expanded={open} onChange={onAccordionClicked}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <ListItemIcon>{ errorCount > 0 ? <Badge badgeContent={errorCount} color="primary" classes={{colorPrimary: classes.errorBGColor}}><NetworkCheckIcon /></Badge>: <NetworkCheckIcon />}</ListItemIcon>
              <ListItemText primary="Measures" />
            {measureCount?<Chip label={measureCount} align="right" key={measureCount}/>:null}
            <div/>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.editorPanel}>
          <Card className={classes.editorCard}>
          <CardContent>
          <FieldArray name="measures" component={this.renderMeasures} />
        </CardContent>
          <CardActions>
          <Button type="submit" color="primary">
          Update
          </Button>
          </CardActions>
          </Card>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        );
    }
}
export default MeasuresForm;
