import 'date-fns';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import DateFnsUtils from '@date-io/date-fns';
// pick a date util library
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { profileExperience } from '../../actions/profile';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    boxShadow:
      '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  grid_center: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  date_time: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  no_padding: {
    padding: '0 !important'
  }
}));

const AddExperience = ({ profileExperience, history }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: new Date(),
    to: new Date(),
    current: false,
    description: ''
  });

  const [todateDisable, toggleDisable] = useState(false);
  const { company, title, location, from, to, current, description } = formData;

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = e => {
    e.preventDefault();
    profileExperience(formData, history);
  };

  return (
    <React.Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Container className={classes.layout}>
          <Typography variant='h6' gutterBottom>
            Add Experience
          </Typography>
          <form >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name='company'
                  label='Company'
                  fullWidth
                  value={company}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name='title'
                  label='Title'
                  fullWidth
                  value={title}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name='location'
                  label='Location'
                  fullWidth
                  value={location}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} className={classes.date_time}>
                <KeyboardDatePicker
                  format='MM/dd/yyyy'
                  name='from'
                  value={from}
                  disableFuture
                  openTo='year'
                  label='From'
                  views={['year', 'month', 'date']}
                  onChange={date => {
                    setFormData({ ...formData, from: date });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.date_time}>
                <KeyboardDatePicker
                  format='MM/dd/yyyy'
                  name='to'
                  value={to}
                  disableFuture
                  openTo='year'
                  label='To'
                  views={['year', 'month', 'date']}
                  readOnly={todateDisable ? true : ''}
                  onChange={date => {
                    setFormData({ ...formData, to: date });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Checkbox
                  className={classes.no_padding}
                  type='checkbox'
                  checked={current}
                  name='current'
                  value={current}
                  onChange={e => {
                    setFormData({ ...formData, current: !current });
                    toggleDisable(!todateDisable);
                  }}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />{' '}
                Current Job
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name='description'
                  label='Description'
                  multiline
                  fullWidth
                  value={description}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} className={classes.grid_center}>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  onClick={onSubmit}
                  className={classes.button}
                  endIcon={<Icon>send</Icon>}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </MuiPickersUtilsProvider>
    </React.Fragment>
  );
};

AddExperience.propTypes = {
  profileExperience: PropTypes.func.isRequired
};

// const mapStateToProps = state => ({
//   profile: state.profile
// });

export default connect(null, { profileExperience })(withRouter(AddExperience));
