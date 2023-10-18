function changeUserRole(userId) {
    fetch(`/api/user/updateRole/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire('Role Updated!', 'User role has been successfully updated', 'success');
        } else {
          Swal.fire('Error!', 'An error occurred while updating the user role', 'error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire('Error!', 'An error occurred while updating the user role', 'error');
      });
  }
  
  function deleteUser(userId) {
    fetch(`/api/user/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire('Deleted!', 'User has been successfully deleted', 'success');
        } else {
          Swal.fire('Error!', 'An error occurred while deleting the user', 'error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire('Error!', 'An error occurred while deleting the user', 'error');
      });
  }
  