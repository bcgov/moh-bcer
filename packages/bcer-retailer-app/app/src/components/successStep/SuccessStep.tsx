import React from 'react';
import { makeStyles, Paper, Typography, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CheckIcon from '@material-ui/icons/Check';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { SuccessStepEnum } from '@/constants/localEnums';
import NoiActive from '@/assets/images/noi-active.png';
import NoiInactive from '@/assets/images/noi-inactive.png';
import ProductActive from '@/assets/images/product-active.png';
import ProductInactive from '@/assets/images/product-inactive.png';
import ManufacturingActive from '@/assets/images/manufacturing-active.png';
import ManufacturingInactive from '@/assets/images/manufacturing-inactive.png';
import TrendingUpActive from '@/assets/images/trending_up-active.png';
import TrendingUpInactive from '@/assets/images/trending_up-inactive.png';


const useStyles = makeStyles({
  container: {
    display: 'flex',
    borderRadius: '4px',
    padding: '20px',
    marginBottom: '20px',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerActive: {
    border: '1px solid #0053A4',
    cursor: 'pointer'
  },
  containerInactive: {
    border: '1px solid rgba(0, 83, 164, 0.3)',
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50px',
    width: '50px',
    marginRight: '20px',
    borderRadius: '4px',
  },
  iconWrapperActive: {
    border: '2px solid #0053A4'
  },
  iconWrapperInactive: {
    border: '2px solid rgba(0, 83, 164, 0.3)'
  },
  stepTitle: {
    fontWeight: 600
  },
  stepTitleActive: {
    color: '#424242'
  },
  stepTitleInactive: {
    color: 'rgba(66, 66, 66, 0.3)'
  },
  stepDescriptionActive: {
    color: '#4C4C4C'
  },
  stepDescriptionInactive: {
    color: 'rgba(76, 76, 76, 0.3)'
  },
  icon: {
    height: '28px'
  },
  activeIcon: {
    color: '#002C71'
  },
  inactiveIcon: {
    color: 'rgba(0,44,113, 0.3)'
  }, 
})

export default function SuccessStep (props: {active : boolean,  completed: boolean, step: SuccessStepEnum}) {
  const { active, completed, step } = props;
  const history = useHistory();
  const classes = useStyles();
  let icon = null;

  switch(step) {
    case SuccessStepEnum.noi :
      active
        ? icon = NoiActive
        : icon = NoiInactive
      break;
    case SuccessStepEnum.product :
      active
        ? icon = ProductActive
        : icon = ProductInactive
      break;
    case SuccessStepEnum.manufacturing :
      active
        ? icon = ManufacturingActive
        : icon = ManufacturingInactive
      break;
    case SuccessStepEnum.sale :
      active
        ? icon = TrendingUpActive
        : icon = TrendingUpInactive
      break;
    default :
      return null;
  }

  const handleNavigation = () => {
    switch(step) {
      case SuccessStepEnum.noi :
        history.push('/noi')
        break;
      case SuccessStepEnum.product :
        history.push('/products')
        break;
      case SuccessStepEnum.manufacturing :
        history.push('/manufacturing')
        break;
      case SuccessStepEnum.sale :
        history.push('/sales');
        break;
      default :
        break;
    }
  }

  return (
    <>
      <Paper 
        variant='outlined'
        onClick={() => active ? handleNavigation() : null}
        className={
          `${classes.container} ${active ? classes.containerActive : classes.containerInactive}`
        }
      >
        <div className={classes.contentWrapper}>
          <div className={
              `${classes.iconWrapper} ${active ? classes.iconWrapperActive : classes.iconWrapperInactive}`
            }
          >
            <img src={icon} className={classes.icon} />
          </div>
          <div>
            <Typography variant='body2' className={
                `${classes.stepTitle} ${active ? classes.stepTitleActive : classes.stepTitleInactive}`
              }
            >
              {
                step === SuccessStepEnum.noi
                  ? 'NOI'
                : step === SuccessStepEnum.product
                  ? 'Product Report'
                : step === SuccessStepEnum.manufacturing
                  ? 'Manufacturing Report'
                : step === SuccessStepEnum.sale 
                  ? 'Sales Report'
                : null
              }
            </Typography>
            <Typography variant='body1' className={active ? classes.stepDescriptionActive : classes.stepDescriptionInactive}>
              {
                step === SuccessStepEnum.noi
                  ? 'Submit Notice of Intent to sell E-substances'
                : step === SuccessStepEnum.product || step === SuccessStepEnum.manufacturing
                  ? 'Manually fill in form or upload CSV file'
                : step === SuccessStepEnum.sale 
                  ? 'Upload CSV file'
                : null
              }
            </Typography>
          </div>
        </div>
        {
          completed
            ?
              <CheckIcon className={active ? classes.activeIcon : classes.inactiveIcon}/>
            :
              <ArrowForwardIcon className={active ? classes.activeIcon : classes.inactiveIcon}/>
        }
      </Paper>
    </>
  )
}