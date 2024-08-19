import React, { useContext, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import { Form, Formik } from 'formik';
import { StyledAccordionGroup, StyledAccordion, StyledButton, StyledDialog, StyledTextField, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import { ConfigContext } from '@/contexts/Config';
import { faqValidationSchema } from '@/constants/validate';
import DragAndDrop from '@/components/dragable';
import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';

const ContentWrapper = styled('div')({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
});

const Content = styled('div')({
  maxWidth: '1440px',
  width: '95%',
  padding: '20px 30px',
});

const AddButton = styled(StyledButton)({
  minWidth: '165px',
  marginBottom: '20px',
});

const ButtonIcon = styled(AddCircleOutlined)({
  paddingRight: '5px',
  color: 'white',
  fontSize: '20px',
});

export default function FAQManagement() {
  const { config } = useContext(ConfigContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [{data: faqList, error: faqListError, loading: faqListLoading}, get] = useAxiosGet('/data/faq');
  const [{error: faqListUpdateError, loading: faqListUpdateLoading}, patch] = useAxiosPatch('/data/faq', { manual: true });
  const [isAddQuestionOpen, setAddQuestionOpen] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [elementOrder, setElementOrder] = useState([]);
  const [selectedEditElement, setSelectedEditElement] = useState(null);
  const [selectedDeleteElement, setSelectedDeleteElement] = useState(null);

  const toggleAddQuestionForm = (openState: boolean) => {
    setAddQuestionOpen(openState);
    setSelectedEditElement(null);
  };

  const handleEdit = (id: string) => {
    setSelectedEditElement(elementOrder.find((element: any) => element.id === id));
  };
  
  const handleDelete = (id: string) => {
    setSelectedDeleteElement(id);
    setConfirmDialogOpen(true);
  };

  const handleReorder = async (items: Array<{id: string, title: string, description: string}>) => {
    setElementOrder(items);

    await patch({
      data: {
        id: faqList.id,
        content: JSON.stringify(items)
      }
    });
  };

  const handleExpand = (id: string) => (event: React.SyntheticEvent, expanded: boolean) => {
    setExpandedId(expanded ? id : null);
  };

  const handleSubmitNew = async (values: {id: string, title: string, description: string}) => {
    let arrayCopy = elementOrder ? [...elementOrder] : [];
    arrayCopy.push({ id: `${arrayCopy.length + 1}`, title: values.title, description: values.description });

    await patch({
      data: {
        id: faqList.id || '',
        content: JSON.stringify(arrayCopy)
      }
    });
    setAddQuestionOpen(false);
    await get();
  };

  const handleSubmitEdit = async (values: {id: string, title: string, description: string}) => {
    const updatedArray = elementOrder.map((element: any) => element.id === values.id ? values : element);

    await patch({
      data: {
        id: faqList.id,
        content: JSON.stringify(updatedArray)
      }
    });
    setSelectedEditElement(null);
    await get();
  };

  const handleSubmitDelete = async () => {
    const updatedArray = elementOrder.filter((element: any) => element.id !== selectedDeleteElement);

    await patch({
      data: {
        id: faqList.id,
        content: JSON.stringify(updatedArray)
      }
    });

    setConfirmDialogOpen(false);
    await get();
  };

  useEffect(() => {
    if (faqList) {
      setElementOrder(JSON.parse(faqList.content));
    }
  }, [faqList]);
  
  useEffect(() => {
    if (faqListUpdateError) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(faqListUpdateError)
      });
    }
  }, [faqListUpdateError, appGlobal, setAppGlobal]);

  useEffect(() => {
    if (faqListError) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(faqListError)
      });
    }
  }, [faqListError, appGlobal, setAppGlobal]);

  return (
    <>
      {faqListLoading ? (
        <CircularProgress />
      ) : (
        <ContentWrapper>
          <Content>
            <Typography variant="h5">FAQ Management</Typography>
            {config.permissions.MANAGE_FAQ && (
              <>
                <AddButton 
                  variant="contained"
                  onClick={() => toggleAddQuestionForm(true)}
                >
                  <ButtonIcon />
                  Add Question
                </AddButton>
                <DragAndDrop
                  state={elementOrder}
                  setState={handleReorder}
                  Component={StyledAccordion}
                  componentProps={{isEditable: true, isDeletable: true, editCallback: handleEdit, deleteCallback: handleDelete, expandedId: expandedId, expandCallback: handleExpand}}
                />
              </>
            ) || (
              <StyledAccordionGroup options={elementOrder} />
            )}
          </Content>
          <Formik
            initialValues={selectedEditElement ? selectedEditElement : {title: '', description: ''}}
            validationSchema={faqValidationSchema}
            onSubmit={(values) => {
              selectedEditElement ? handleSubmitEdit(values) : handleSubmitNew(values);
            }}
            enableReinitialize
          >
            <Form>
              <StyledDialog
                open={isAddQuestionOpen || !!selectedEditElement}
                title="Add Question"
                scroll="body"
                maxWidth="sm"
                onClose={() => toggleAddQuestionForm(false)}
                cancelButtonText="Cancel"
                acceptButtonText="Submit"
                cancelHandler={() => toggleAddQuestionForm(false)}
                acceptHandler="submit"
              >
                <StyledTextField
                  label={
                    <div>
                      Question
                      <span style={{color: 'red'}}> *</span>
                    </div>
                  }
                  name="title"
                  variant="outlined"
                  fullWidth
                  rows={5}
                  multiline
                />
                <StyledTextField
                  label={
                    <div>
                      Response
                      <span style={{color: 'red'}}> *</span>
                    </div>
                  }
                  name="description"
                  variant="outlined"
                  fullWidth
                  rows={5}
                  multiline
                />
              </StyledDialog>
            </Form>
          </Formik>
          <StyledConfirmDialog
            open={isConfirmDialogOpen}
            maxWidth="xs"
            dialogTitle="Delete Question"
            checkboxLabel="I understand that this question will be permanently removed from the database."
            dialogMessage="You are about to delete the question and it will affect the Retailer's Portal. This action cannot be undone."
            setOpen={() => setConfirmDialogOpen(false)}
            confirmHandler={handleSubmitDelete}
            acceptButtonText="Delete Now"
          />
        </ContentWrapper>
      )}
    </>
  );
}