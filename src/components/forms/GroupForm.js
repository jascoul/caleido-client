import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Field, Fields } from 'redux-form'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GroupIcon from '@material-ui/icons/Group';
import Badge from '@material-ui/core/Badge';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { mappedTextField, mappedSelect, mappedRelationField } from '../widgets/mapping.js';

import styles from './formStyles.js';

@withStyles(styles, { withTheme: true })
class GroupForm extends React.Component {
    getErrorCount() {
        if (!this.props.errors){
            return 0
        }
        let errorCount = 0;
        for (const field of ['international_name', 'native_name', 'abbreviated_name', 'type', 'start_date', 'end_date', 'location']){
            if (this.props.errors[field] !== undefined){
                errorCount += 1;
            }
        }
        return errorCount
    }

    render(){
      const { classes, onAccordionClicked, open, typeOptions } = this.props;
      const errorCount = this.getErrorCount();

      return (
          <ExpansionPanel expanded={open} onChange={onAccordionClicked}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <ListItemIcon>{ errorCount > 0 ? <Badge badgeContent={errorCount} color="primary" classes={{colorPrimary: classes.errorBGColor}}><GroupIcon /></Badge>: <GroupIcon />}</ListItemIcon>
              <ListItemText primary="Group" />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.editorPanel}>
          <Card className={classes.editorCard}>
          <CardContent>
           <div className={classes.formItem}>
             <Field name="type" component={mappedSelect} options={typeOptions} label="Type" className={classes.flex}/>
             <span className={classes.gutter}> </span>
             <Field name="international_name" component={mappedTextField} label="International Name" className={classes.flex}/>
           </div>
           <div className={classes.formItem}>
             <Field name="native_name" component={mappedTextField} label="Native Name" className={classes.flex}/>
             <span className={classes.gutter}> </span>
             <Field name="abbreviated_name" component={mappedTextField} label="Abbreviated Name" className={classes.flex}/>
           </div>
           <div className={classes.formItem}>
             <Fields names={['parent_id', '_parent_name']}
                    component={mappedRelationField}
                    placeholder="Part of parent Group"
                    kind="group"
                    className={classes.flex}/>
           </div>
           <div className={classes.formItem}>
             <Field name="start_date"
                    component={mappedTextField}
                    type="date"
                    label="Start Date"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
             <Field name="end_date"
                    component={mappedTextField}
                    type="date"
                    label="End Date"
                    className={classes.flex}
                    InputLabelProps={{shrink: true}}/>
             <span className={classes.gutter}> </span>
             <Field name="location"
                    component={mappedTextField}
                    label="Location"
                    className={classes.flex} />
          </div>
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
export default GroupForm;
