import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles, Typography } from '@mui/material';
import { StyledHeaderMapperProps } from '@/constants/interfaces/inputInterfaces';
import { Formik, Form } from 'formik';
import { StyledSelectField } from '@/index';
import * as Yup from 'yup';
import { StyledButton } from '@/index';


const PREFIX = 'StyledHeaderMapper';

const classes = {
  header: `${PREFIX}-header`,
  headerText: `${PREFIX}-headerText`,
  requiredColumn: `${PREFIX}-requiredColumn`,
  csvHeaderColumn: `${PREFIX}-csvHeaderColumn`,
  previewColumn: `${PREFIX}-previewColumn`,
  mapRow: `${PREFIX}-mapRow`,
  rowText: `${PREFIX}-rowText`,
  actionWrapper: `${PREFIX}-actionWrapper`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.header}`]: {
    display: 'flex',
    borderBottom: '2px solid #F5A623',
    padding: '20px',

  },
  [`& .${classes.headerText}`]: {
    color: '#002C71',
    fontWeight: 600
  },
  [`& .${classes.requiredColumn}`]: {
    width: '290px',
    paddingRight: '20px'
  },
  [`& .${classes.csvHeaderColumn}`]: {
    width: '235px',
    marginRight: '20px'
    
  },
  [`& .${classes.previewColumn}`]: {
    width: '190px',
  },
  [`& .${classes.mapRow}`]: {
    display: 'flex',
    padding: '20px 20px 0px 20px'
  },
  [`& .${classes.rowText}`]: {
    color: '#333333'
  },
  [`& .${classes.actionWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '16px'
  }
});

// THIS IS WIP
// const ContextHandler = ({setOptionsHandler, stateOptions}: ContextProps ): null => {
//   const { values, isValid }: any = useFormikContext();
//   console.log('values: ', values)
//   useEffect(() => {
//     console.log('values: ', values, 'isValid: ', isValid)
//     const temp = stateOptions.filter(o => {
//         // return o
//       let found = false;
//         Object.values(values).filter(v => {
//           if(o.value === v) {
//             found = true
//           }
//         })
//         console.log('found: ',found)

//       if (found === false){
//         return o
//       } else {
//         return null
//       }
//     })
//     console.log(typeof setOptionsHandler,'TEMP: ', temp )
//   }, [values]);
//   return null;
// };


/**
 * @param requiredHeaders `Enum` - an Enum containing key-value pairs of the required DTO options, and their human readable strings
 * @param providedHeaders `Array<string>` - List of headers provided by the API CSV header parsing
 * @param updateMapCallback `Function` - callback for returning the mapped header object
 * @param cancelHandler `Function` - callback for cancelling the mapping
 * @returns ReactElement component
 */
export function StyledHeaderMapper({requiredHeaders, providedHeaders, updateMapCallback, cancelHandler}: StyledHeaderMapperProps) {

  const [initialValues] = useState<Object>({});
  const [options] = useState(providedHeaders.map(h => ({value: h, label: h})));
  type ValidationSchemaType = Yup.AnyObjectSchema | undefined;
  const [validationSchema, setValidationSchema] = useState<ValidationSchemaType>(undefined);
  const keys = Object.keys(requiredHeaders);
  const values: Array<string> = Object.values(requiredHeaders);
  
  useEffect(()=> {
    let temp = {}
    keys.map(k => {
      let found = options.find(o => o.value === k)
      found ? initialValues[k] = found.value : initialValues[k] = ''      
      temp[k] = Yup.string().required('Required selection')
    })
    const schema: Yup.AnyObjectSchema = Yup.object().shape(temp) as Yup.AnyObjectSchema;
    setValidationSchema(schema)
  }, [])
  
  const testHandler = (values: any) => {
    updateMapCallback(values)
  }

  return (
    (<Root>
      {
        validationSchema !== undefined && initialValues !== undefined
          ?
          <Formik 
            onSubmit={values => testHandler(values)}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            <Form>
              <div className={classes.header}>
                <Typography variant='body2' className={`${classes.headerText} ${classes.requiredColumn}`}>Required field in our system</Typography>
                <Typography variant='body2' className={`${classes.headerText} ${classes.csvHeaderColumn}`}>Field from your CSV file</Typography>
              </div>
              {
                keys.map((header: string, index: number) => (
                  <>
                    <div key={index} className={classes.mapRow}>
                      <Typography variant='body1' className={`${classes.requiredColumn} ${classes.rowText}`}>
                        {values[index]}
                      </Typography>
                      <div className={classes.csvHeaderColumn}>
                        <StyledSelectField name={header} label='' options={options} />
                      </div>
                    </div>
                  </>
                ))
              }
              <div className={classes.actionWrapper}>
                {
                  cancelHandler
                    ?
                      <StyledButton variant='outlined' onClick={() => cancelHandler()}>Cancel</StyledButton>
                    : null
                }
                <StyledButton variant='contained' type='submit'>Map Headers</StyledButton>
              </div>
              {/* <ContextHandler setOptionsHandler={setOptions} stateOptions={options}/> */}
            </Form>
          </Formik>
        : null
      }
    </Root>)
  );
}