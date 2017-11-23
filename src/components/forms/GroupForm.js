import React from 'react';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import { Field } from 'redux-form'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import GroupIcon from 'material-ui-icons/Group';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Collapse from 'material-ui/transitions/Collapse';
import Badge from 'material-ui/Badge';
import InputLabel from 'material-ui/Input';
import { mappedTextField, mappedSelect } from '../widgets/mapping.js';
import styles from '../EditorStyles.js';

@withStyles(styles, { withTheme: true })
class PersonForm extends React.Component {
    getErrorCount() {
        if (!this.props.errors){
            return 0
        }
        let errorCount = 0;
        for (const field of ['international_name', 'native_name', 'abbreviated_name', 'type']){
            if (this.props.errors[field] !== undefined){
                errorCount += 1;
            }
        }
        return errorCount
    }

    render(){
      const { classes, onAccordionClicked, open, typeOptions } = this.props;
      const errorCount = this.getErrorCount();

      return (<div><ListItem button onClick={onAccordionClicked}>
            <ListItemIcon>{ errorCount > 0 ? <Badge badgeContent={errorCount} color="primary" classes={{colorPrimary: classes.errorBGColor}}><GroupIcon /></Badge>: <GroupIcon />}</ListItemIcon>
            <ListItemText primary="Group" />
            <ListItemIcon>{open ? <ExpandLess />: <ExpandMore />}</ListItemIcon>
          </ListItem>
          <Collapse in={open} transitionDuration="auto" unmountOnExit>
          <Card>
          <CardContent className={classes.accordionCard}>
           <div className={classes.flexContainer}>
             <Field name="international_name" component={mappedTextField} label="International Name" className={classes.flex}/>
           </div>
           <div className={classes.flexContainer}>
             <Field name="native_name" component={mappedTextField} label="Native Name" className={classes.flex}/>
           </div>
           <div className={classes.flexContainer}>
             <Field name="abbreviated_name" component={mappedTextField} label="Abbreviated Name" className={classes.flex}/>
           </div>
           <div className={classes.flexContainer}>
             <Field name="type" component={mappedSelect} options={typeOptions} label="Type" className={classes.flex}/>
           </div>
        </CardContent>
      </Card>
          </Collapse>
</div>
      );
    }
}
export default PersonForm;
