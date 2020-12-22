import React, { useState, useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { StyledHeaderMapperProps } from '@/constants/interfaces/inputInterfaces';
import { Formik, Form } from 'formik';
import { StyledSelectField } from '@/index';
import * as Yup from 'yup';
import { StyledButton } from '@/index';


const useStyles = makeStyles({
  header: {
    display: 'flex',
    borderBottom: '2px solid #F5A623',
    padding: '20px',

  },
  headerText: {
    color: '#002C71',
    fontWeight: 600
  },
  requiredColumn: {
    width: '290px',
    paddingRight: '20px'
  },
  csvHeaderColumn: {
    width: '235px',
    marginRight: '20px'
    
  },
  previewColumn: {
    width: '190px',
  },
  mapRow: {
    display: 'flex',
    padding: '20px 20px 0px 20px'
  },
  rowText: {
    color: '#333333'
  },
  actionWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '16px'
  }
})

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
  const classes = useStyles();
  const [initialValues] = useState<Object>({});
  const [options] = useState(providedHeaders.map(h => ({value: h, label: h})));
  const [validationSchema, setValidationSchema] = useState<Yup.ObjectSchema<any | undefined>>();
  const keys = Object.keys(requiredHeaders);
  const values: Array<string> = Object.values(requiredHeaders);
  
  useEffect(()=> {
    let temp = {}
    keys.map(k => {
      let found = options.find(o => o.value === k)
      found ? initialValues[k] = found.value : initialValues[k] = ''      
      temp[k] = Yup.string().required('Required selection')
    })
    setValidationSchema(Yup.object().shape(temp))
  }, [])
  
  const testHandler = (values: any) => {
    updateMapCallback(values)
  }

  return(
    <>
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
              <Typography variant='body2' className={`${classes.headerText} ${classes.csvHeaderColumn}`}>Required field in our system</Typography>
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
    </>
  )
}