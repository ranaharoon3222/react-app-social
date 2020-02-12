import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile';
import { connect } from 'react-redux';

const Education = ({ education, deleteEducation }) => {
  const [state, setState] = React.useState({
    columns: [
      { title: 'School', field: 'school' },
      { title: 'id', field: '_id', hidden: true },
      { title: 'Degree', field: 'degree' },
      { title: 'Fieldofstudy', field: 'fieldofstudy' },
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
    data: education
  });
  // console.log(education);
  return (
    <MaterialTable
      title='Education'
      columns={state.columns}
      data={state.data}
      actions={[
        {
          icon: 'delete_outline',
          tooltip: 'Save User',
          onClick: (event, rowData) => {
            setTimeout(() => {
              deleteEducation(rowData._id);

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

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteEducation })(Education);
