import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = (theme:any) => ({
//   container: {
//     display: "flex",
//     // flexWrap: "wrap",
//     padding: 50
//   },
//   textField: {
//     marginLeft: theme.spacing.unit,
//     marginRight: theme.spacing.unit,
//     width: 300,
//     color: "black",
//     fontSize: 30,
//     opacity: 1,
//     borderBottom: 0,
//     "&:before": {
//       borderBottom: 0
//     }
//   },
  disabled: {
    color: "black",
    borderBottom: 0,
    "&:before": {
      borderBottom: 0
    }
  },
  btnIcons: {
    marginLeft: 10
  }
});

class StyledEditableTextField extends React.Component <any, any> {
  state = {
    email: "johndoe@domain.com",
    editMode: false,
    mouseOver: false
  };

  handleChange = (event:any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleMouseOver = (event:any) => {
    if (!this.state.mouseOver) {
      this.setState({ mouseOver: true });
    }
  };

  handleMouseOut = (event:any) => {
    // The problem is here!!!
    if (this.state.mouseOver) {
      this.setState({ mouseOver: false });
    }
  };

  handleClick = () => {
    this.setState({
      editMode: true,
      mouseOver: false
    });
  };

  render() {
    const { classes, value } = this.props;

    return (
    //   <div className={classes.container}>
        <TextField
        //   name="email"
          defaultValue={value}
        //   margin="normal"
          error={this.state.email === ""}
          onChange={this.handleChange}
          disabled={!this.state.editMode}
          className={classes.textField}
          onMouseEnter={this.handleMouseOver}
          onMouseLeave={this.handleMouseOut}
          InputProps={{
            classes: {
              disabled: classes.disabled
            },
            endAdornment: this.state.mouseOver ? (
              <InputAdornment position="end">
                <IconButton onClick={this.handleClick}>
                  <Edit />
                </IconButton>
              </InputAdornment>
            ) : (
              ""
            )
          }}
        />
    //   </div>
    );
  }
}

export default withStyles(styles)(StyledEditableTextField);
