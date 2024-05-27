import React from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles, Paper, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { SuccessStepEnum } from '@/constants/localEnums';
import NoiActive from '@/assets/images/noi-active.png';
import NoiInactive from '@/assets/images/noi-inactive.png';
import ProductActive from '@/assets/images/product-active.png';
import ProductInactive from '@/assets/images/product-inactive.png';
import ManufacturingActive from '@/assets/images/manufacturing-active.png';
import ManufacturingInactive from '@/assets/images/manufacturing-inactive.png';
import TrendingUpActive from '@/assets/images/trending_up-active.png';
import TrendingUpInactive from '@/assets/images/trending_up-inactive.png';


const PREFIX = 'SuccessStep';

const classes = {
  container: `${PREFIX}-container`,
  containerActive: `${PREFIX}-containerActive`,
  containerInactive: `${PREFIX}-containerInactive`,
  contentWrapper: `${PREFIX}-contentWrapper`,
  iconWrapper: `${PREFIX}-iconWrapper`,
  iconWrapperActive: `${PREFIX}-iconWrapperActive`,
  iconWrapperInactive: `${PREFIX}-iconWrapperInactive`,
  stepTitle: `${PREFIX}-stepTitle`,
  stepTitleActive: `${PREFIX}-stepTitleActive`,
  stepTitleInactive: `${PREFIX}-stepTitleInactive`,
  stepDescriptionActive: `${PREFIX}-stepDescriptionActive`,
  stepDescriptionInactive: `${PREFIX}-stepDescriptionInactive`,
  icon: `${PREFIX}-icon`,
  activeIcon: `${PREFIX}-activeIcon`,
  inactiveIcon: `${PREFIX}-inactiveIcon`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.container}`]: {
    display: 'flex',
    borderRadius: '4px',
    padding: '20px',
    marginBottom: '20px',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  [`& .${classes.containerActive}`]: {
    border: '1px solid #0053A4',
    cursor: 'pointer'
  },
  [`& .${classes.containerInactive}`]: {
    border: '1px solid rgba(0, 83, 164, 0.3)',
  },
  [`& .${classes.contentWrapper}`]: {
    display: 'flex',
    alignItems: 'center'
  },
  [`& .${classes.iconWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50px',
    width: '50px',
    marginRight: '20px',
    borderRadius: '4px',
  },
  [`& .${classes.iconWrapperActive}`]: {
    border: '2px solid #0053A4'
  },
  [`& .${classes.iconWrapperInactive}`]: {
    border: '2px solid rgba(0, 83, 164, 0.3)'
  },
  [`& .${classes.stepTitle}`]: {
    fontWeight: 600
  },
  [`& .${classes.stepTitleActive}`]: {
    color: '#424242'
  },
  [`& .${classes.stepTitleInactive}`]: {
    color: 'rgba(66, 66, 66, 0.3)'
  },
  [`& .${classes.stepDescriptionActive}`]: {
    color: '#4C4C4C'
  },
  [`& .${classes.stepDescriptionInactive}`]: {
    color: 'rgba(76, 76, 76, 0.3)'
  },
  [`& .${classes.icon}`]: {
    height: '28px'
  },
  [`& .${classes.activeIcon}`]: {
    color: '#002C71'
  },
  [`& .${classes.inactiveIcon}`]: {
    color: 'rgba(0,44,113, 0.3)'
  }, 
});

export default function SuccessStep (props: {active : boolean,  completed: boolean, step: SuccessStepEnum}) {
  const { active, completed, step } = props;
  const navigate = useNavigate();

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
        navigate('/noi')
        break;
      case SuccessStepEnum.product :
        navigate('/products')
        break;
      case SuccessStepEnum.manufacturing :
        navigate('/manufacturing')
        break;
      case SuccessStepEnum.sale :
        navigate('/sales');
        break;
      default :
        break;
    }
  }

  return (
    (<Root>
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
    </Root>)
  );
}