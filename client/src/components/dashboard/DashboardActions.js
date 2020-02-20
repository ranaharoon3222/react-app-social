import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteAccount } from '../../actions/profile';
import PropTypes from 'prop-types';

const DashboardActions = ({ deleteAccount }) => {
  return (
    <div className='dash-buttons'>
      <Link to='edit-profile' className='btn btn-light'>
        <i className='fas fa-user-circle text-primary'></i> Edit Profile
      </Link>
      <Link to='add-experience' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary'></i> Add Experience
      </Link>
      <Link to='add-education' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary'></i> Add Education
      </Link>
      <Button
        variant='contained'
        color='secondary'
        startIcon={<DeleteIcon />}
        onClick={() => deleteAccount()}
      >
        Delete Account
      </Button>
    </div>
  );
};

DashboardActions.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { deleteAccount })(DashboardActions);
