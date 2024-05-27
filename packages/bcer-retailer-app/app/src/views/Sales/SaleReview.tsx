import React, { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles, createStyles } from '@mui/material';

import withNav from '@/components/Sales/withNav';
import { SalesReportContext } from '@/contexts/SalesReport';
import UploadSuccess from '@/assets/images/file-check.png';
import ReplaceWarning from '@/components/Sales/ReplaceWarning';

const PREFIX = 'SaleReview';

const classes = {
  title: `${PREFIX}-title`,
  description: `${PREFIX}-description`,
  box: `${PREFIX}-box`,
  boxTitle: `${PREFIX}-boxTitle`,
  boxDescription: `${PREFIX}-boxDescription`,
  radioGroup: `${PREFIX}-radioGroup`,
  boxHeader: `${PREFIX}-boxHeader`,
  textWrapper: `${PREFIX}-textWrapper`,
  linkWrapper: `${PREFIX}-linkWrapper`,
  linkText: `${PREFIX}-linkText`,
  boxContent: `${PREFIX}-boxContent`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  uploadedFile: `${PREFIX}-uploadedFile`,
  contentWrapper: `${PREFIX}-contentWrapper`,
  successfulFileIcon: `${PREFIX}-successfulFileIcon`,
  uploadedDescription: `${PREFIX}-uploadedDescription`,
  filename: `${PREFIX}-filename`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    // TODO: grab any color data from theme once implemented
    theme
  }
) => ({
  [`& .${classes.title}`]: {
    color: '#002C71',
    fontSize: '27px',
    fontWeight: 600,
    padding: '30px 0px 20px 0px ',
  },

  [`& .${classes.description}`]: {
    color: '#0053A4',
    fontSize: '20px',
    fontWeight: 600,
    paddingBottom: '30px',
  },

  [`& .${classes.box}`]: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },

  [`& .${classes.boxTitle}`]: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: '22px',
  },

  [`& .${classes.boxDescription}`]: {
    fontSize: '16px',
    color: '#3A3A3A',
    lineHeight: '20px',
    marginTop: '1rem',
  },

  [`& .${classes.radioGroup}`]: {
    width: '50px',
  },

  [`& .${classes.boxHeader}`]: {
    width: '100%',
    display: 'inline-flex',
    margin: '5px 0px 5px 0px',
  },

  [`& .${classes.textWrapper}`]: {
    paddingBottom: '20px',
  },

  [`& .${classes.linkWrapper}`]: {
    textDecorationColor: '#1E5DB1',
  },

  [`& .${classes.linkText}`]: {
    display: 'inline',
    color: '#1E5DB1',
  },

  [`& .${classes.boxContent}`]: {
    display: 'block',
    width: '100%',
  },

  [`& .${classes.dialogTitle}`]: {
    size: '20px',
    color: '#0053A4',
    borderBottom: '1px solid #CCCCCC',
    padding: '0px 0px 16px 0px',
    margin: '16px 24px 0px 24px',
  },

  [`& .${classes.uploadedFile}`]: {
    width: '50%',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    borderRadius: '4px',
    backgroundColor: '#F2F6FA',
    padding: '15px 0px 15px 20px',
  },

  [`& .${classes.contentWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.successfulFileIcon}`]: {
    height: '30px',
    paddingRight: '20px',
  },

  [`& .${classes.uploadedDescription}`]: {
    padding: '10px 0px 10px 0px',
  },

  [`& .${classes.filename}`]: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#424242',
  }
}));

function SaleReview() {


  const [sale, setSale] = useContext(SalesReportContext);

  return (
    (<Root>
      <div>
        <div className={classes.title}>
          {sale.isSubmitted ? 'Replace' : 'Upload'} Sales Report for location
        </div>
        <div
          className={classes.description}
        >{`${sale?.doingBusinessAs}, ${sale?.address}`}</div>

        <div className={classes.box}>
          <div className={classes.boxContent}>
            <div className={classes.boxHeader}>
              <div className={classes.textWrapper}>
                <div className={classes.boxTitle}>2. Review Submission</div>
                <div className={classes.boxDescription}>
                  You are going to{' '}
                  {sale.isSubmitted
                    ? 'replace a previously submitted'
                    : 'submit'}{' '}
                  Sales Report for this location:
                </div>
                <div className={classes.boxDescription}>
                  <strong>{`${sale?.doingBusinessAs}, ${sale?.address}`}</strong>
                </div>
              </div>
            </div>
            <div className={classes.uploadedFile}>
              <div className={classes.contentWrapper}>
                <img
                  className={classes.successfulFileIcon}
                  src={UploadSuccess}
                />
                <div>
                  <div className={classes.filename}>{sale?.fileData?.name}</div>
                </div>
              </div>
            </div>
            {sale.isSubmitted ? <ReplaceWarning /> : null}
            <div>
              <div className={classes.boxDescription}>
                Please carefully check the information before selecting “
                <strong>Confirm Submission</strong>”.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Root>)
  );
}

export default withNav({
  cancelRoute: '/sales',
  isAction: true,
  confirmTitle: 'Confirm Submission',
  confirmAction: (setSale: any) =>
    setSale((sale: any) => ({ ...sale, isConfirmOpen: true })),
})(SaleReview);
