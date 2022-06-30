import { Heading, Input, Text,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Box,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    InputLeftElement,
    InputGroup,
    Textarea,
    Progress,
    Link,
    useToast,
    Select
} from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import SidebarWithHeader from "../../layouts/dashboardLayout";
import { storage, db, auth } from '../../firebaseConfig';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CreateReimbursement = () => {

    function validateName(value) {
        let error
        if (!value) {
          error = 'This is required'
        }
        return error
    }

    function validateFile(value) {
        let error
        if (!value) {
          error = 'File is required'
        }
        return error
    }

    const [fileUrl, setFileUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);

    const toast = useToast();
    const auth = getAuth();

    return (
        <SidebarWithHeader>
            <Heading>Request Reimbursement</Heading>
            <Text>Enter the information about your reimbursement request.</Text>
            <Box maxWidth={500} mt={50}>
                <Formik
                    initialValues={{ receiver: '', subject: '', amount: '', desc:'', date:'', receiptUpload:''}}
                    onSubmit = {async (values, actions) => {
                        console.log(values)
                        const storageRef = ref(storage, `reimbursements/${values.receiptUpload.name}`);
                        const uploadTask = uploadBytesResumable(storageRef, values.receiptUpload);
                        try {
                            uploadTask.on("state_changed",
                          (snapshot) => {
                            const progress =
                                Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                console.log(progress)
                            setProgresspercent(progress);
                          },
                          (error) => {
                                alert(error);
                          },
                          () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                setFileUrl(downloadURL)

                                addDoc(collection(db, "reimbursements"), {
                                    user: auth.currentUser.displayName,
                                    amount : values.amount,
                                    date: values.date,
                                    desc :  values.desc,
                                    status: 'Pending',
                                    receipt: downloadURL,
                                    category: values.category,
                                    subject: values.subject,
                                    receiver: values.receiver,
                                })
        
                                actions.setSubmitting(false)
                                toast({
                                    title: 'Reimbursement Request Submitted.',
                                    description: "The Treasurer will review and process your request soon.",
                                    status: 'success',
                                    duration: 9000,
                                    isClosable: true,
                                });
                                actions.resetForm();
                            });
                          }
                        );
                        } catch (err) {
                            toast({
                                title: 'Error Submitting Request',
                                description: "There has unfortunately been an error when requesting this reimbursement. Please try again later.",
                                status: 'error',
                                duration: 9000,
                                isClosable: true,
                            });
                        }
                        

                    }}
                    >
                    {(props) => (
                        <Form>
                        <Field name='subject' validate={validateName}>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.subject && form.touched.subject} mb={2}>
                                <FormLabel htmlFor='subject'>Subject</FormLabel>
                                <Input {...field} id='subject' placeholder='Subject of request' bg={'white'}/>
                                <FormErrorMessage>{form.errors.subject}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Field name='receiver' validate={validateName}>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.receiver && form.touched.receiver} mb={2}>
                                <FormLabel htmlFor='receiver'>Receiver</FormLabel>
                                <Input {...field} id='receiver' placeholder='Who you paid' bg={'white'}/>
                                <FormErrorMessage>{form.errors.receiver}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Field name='category'>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.category && form.touched.category} mb={2}>
                                <FormLabel htmlFor='category'>Category</FormLabel>
                                    <Select {...field} id='category' bg={'white'} placeholder='Select Category' required>
                                        <option value='Ads'>Ads</option>
                                        <option value='Campaigns'>Campaigns</option>
                                        <option value='Admin'>Admin</option>
                                        <option value='Speakers'>Speakers</option>
                                        <option value='Transport'>Transport</option>
                                        <option value='Accomodation'>Accomodation</option>
                                        <option value='Venue'>Venue</option>
                                        <option value='Logistics'>Logistics</option> 
                                        <option value='Storage'>Storage</option>
                                        <option value='Other (enter in description)'>Other (enter in description)</option>
                                    </Select>
                                <FormErrorMessage>{form.errors.category}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Field name='date'>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.date && form.touched.date} mb={2}>
                                <FormLabel htmlFor='date'>Date of Payment</FormLabel>
                                <Input type={'date'} {...field} id='date' placeholder='date' bg={'white'} required/>
                                <FormErrorMessage>{form.errors.date}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Field name='amount'>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.amount && form.touched.amount} mb={2}>
                                <FormLabel htmlFor='amount'>Amount (£)</FormLabel>
                                    <NumberInput  precision={2}>
                                    <NumberInputField {...field} bg={'white'} id='amount' placeholder='Amount' required/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                    </NumberInput>
                                <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Field name='desc'>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.desc && form.touched.desc} mb={2}>
                                <FormLabel htmlFor='desc'>Description</FormLabel>
                                    <Textarea {...field} bg={'white'} id='desc' placeholder='Detail what the payment was for' required></Textarea>
                                <FormErrorMessage>{form.errors.desc}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Field name={'receiptUpload'} validate={validateFile}>
                        {({ field, form }) => (
                            <FormControl>
                                <FormLabel htmlFor='receiptUpload'>Upload Receipt</FormLabel>
                                <input type={'file'} name={'receiptUpload'} id='receiptUpload' bg={'white'} onChange={(e) => {
                                    form.setFieldValue("receiptUpload", e.currentTarget.files[0]);
                                }} />
                                {
                                    fileUrl &&
                                    <Link to={fileUrl}>Your Upload</Link>
                                }
                                {
                                    !fileUrl &&
                                    <Progress value={progresspercent} mt={5}/>
                                }
                                
                                <FormErrorMessage>{form.errors.receiptUpload}</FormErrorMessage>
                            </FormControl>

                            )}
                        </Field>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='submit'
                        >
                            Submit
                        </Button>
                        </Form>
                    )}
                    </Formik>
            </Box>
        </SidebarWithHeader>
    )
}

export default CreateReimbursement;