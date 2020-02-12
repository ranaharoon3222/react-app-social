import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profile';
import { connect } from 'react-redux';

const Experience = ({ experience, deleteExperience }) => {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Company', field: 'company' },
      { title: 'id', field: '_id', hidden: true },
      { title: 'Title', field: 'title' },
      { title: 'Location', field: 'location' },
      {
        title: 'From',
        field: 'from',
        type: 'date'
      },
      {
        title: 'To',
        field: 'to',
        render: edu => <Moment format='YYYY/MM/DD' date={edu.to} />
      }
    ],
    data: experience
  });
  // console.log(education);
  return (
    <MaterialTable
      title='Experience'
      columns={state.columns}
      data={state.data}
      actions={[
        {
          icon: 'delete_outline',
          tooltip: 'Save User',
          onClick: (event, rowData) => {
            setTimeout(() => {
              deleteExperience(rowData._id);

              setState(prevState => {
                const data = [...prevState.data];
                data.splice(data.indexOf(rowData), 1);
                return { ...prevState, data };
              });
            }, 100);
          }
        }
      ]}
    />
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);
