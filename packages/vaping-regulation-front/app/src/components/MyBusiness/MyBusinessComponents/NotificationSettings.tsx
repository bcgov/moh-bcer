import React from 'react';
import Grid from '@material-ui/core/Grid';

export default function NotificationSettings () {
  return (
    <div>
      <h4>NotificationSettings</h4>
      <Grid container>
        <Grid item xs={6}>
          <h4>Username (you)</h4>
        </Grid>
        <Grid item xs={6}>
          <select>
            <option>All notifications</option>
          </select>
        </Grid>
      </Grid>
    </div>
  )
}
