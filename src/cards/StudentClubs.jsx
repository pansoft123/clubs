// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useEffect, useState,useMemo } from 'react';
import { useIntl } from 'react-intl';

import {Icon } from '@ellucian/ds-icons/lib';
import {
    Button,
    CircularProgress,
    IconButton,
    makeStyles,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@ellucian/react-design-system/core';

import { colorFillAlertError, spacing20, spacing40, spacing80 } from '@ellucian/react-design-system/core/styles/tokens';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { useCardInfo, useData, useExtensionControl } from '@ellucian/experience-extension-utils';

import { DataQueryProvider, userTokenDataConnectQuery, useDataQuery } from '@ellucian/experience-extension-extras';

import { useDashboard } from '../hooks/dashboard';

import EditClub from '../components/EditClub.jsx';

import {  addStudentClub } from '../data/student-club';

const useStyles = makeStyles(() => ({
    root:{
        height: '100%',
        // overflowY: 'auto'
    },
    content: {
        height: '100%',
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        display: 'flex',
        flexDirection: 'column',
    },
    contentMessage: {
        height: '100%',
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    addContactButtonBox: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: spacing40,
        marginBottom: spacing40,
    },
    contactsBox: {
        cursor: 'pointer'
    },
    contactsTableBox: {
        overflowY: 'auto'
    },
    contactsTableRow: {
        height: 'auto'
    },
    addButton: {
        marginRight: spacing20
    },
    actionButtonsBox: {
        marginRight: spacing20
    },
    spinnerBox: {
        height: '100%',
        flex: '1 0 70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    busyBox: {
        height: '100%',
        width: '100%',
        flex: '1 0 70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '0'
    },
    message: {
        marginLeft: spacing80,
        marginRight: spacing80,
        textAlign: 'center'
    }
}), { index: 2});

function StudentClubs() {
    const intl = useIntl();
    const classes = useStyles();
   
    // Experience SDK hooks
    const { setErrorMessage } = useExtensionControl();
    const { authenticatedEthosFetch } = useData();
    const { serverConfigContext: { cardPrefix }, cardId, configuration: { clubLimit,clubFees } = {} } = useCardInfo();
   
    useDashboard();

    const { data: payload, dataError, inPreviewMode, isError, isLoading, isRefreshing, refresh } = useDataQuery(process.env.PIPELINE_GET_STUDENT_CLUBS);

    const [ editClubContext, setEditClubContext ] = useState({ show: false });
    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackMessage, setSnackMessage ] = useState();
    const [ busy, setBusy ] = useState(false);
    const [ busyUntilRefresh, setBusyUntilRefresh ] = useState(false);

    useEffect(() => {
        if (isError) {
            setErrorMessage({
                headerMessage: intl.formatMessage({id: 'StudentClubs.contactAdministrator'}),
                textMessage: intl.formatMessage({id: 'StudentClubs.dataError'}),
                iconName: 'warning',
                iconColor: colorFillAlertError
            });
        }
    }, [intl, isError, setErrorMessage]);

    useEffect(() => {
        if (busy && !busyUntilRefresh && !isRefreshing) {
            setBusy(false);
        }
    }, [busy, busyUntilRefresh, isRefreshing]);

    const addContact = useCallback(async ({name,term,bannerId,clubFees}) => {
        setBusyUntilRefresh(true);
        setBusy(true);
        const postResult = await addStudentClub({ authenticatedEthosFetch, cardId, cardPrefix, contact: { name,term ,bannerId,clubFees} });
        if (postResult.status === 'success') {
            showSnackbarMessage(`Club Activity ${name} was added`);
        }
        if (postResult.status !== 'success') {
            showSnackbarMessage(`Club Activity ${name} not added due to Error ${postResult}`);
        }
        refresh();
        setBusyUntilRefresh(false);
    }, [ authenticatedEthosFetch, cardId, cardPrefix, refresh, showSnackbarMessage, setBusy, setBusyUntilRefresh ]);

    const onAddContact = useCallback(() => {
        setEditClubContext({ addContact, mode: 'add', show: true ,payload,clubLimit,clubFees});
    }, [addContact, setEditClubContext,payload,clubLimit,clubFees]);
 
    const onCloseEditClub = useCallback(() => {
        setEditClubContext({ show: false });
    }, [setEditClubContext]);

    
    const showSnackbarMessage = useCallback(message => {
        setShowSnackbar(true);
        setSnackMessage(message);
    }, [setShowSnackbar, setSnackMessage]);

    const showSpinning = !payload && isLoading;
    const showNotConfigured = !payload && inPreviewMode && dataError?.statusCode === 404;
    const showNoClubs =  !payload?.studentClub?.length===0;

    if (showNotConfigured) {
        return (
            <div className={classes.root}>
                <div className={classes.contentMessage}>
                    <Typography className={classes.message} variant="body1" component="div">
                        {intl.formatMessage({ id: 'StudentClubs.notConfigured'})}
                    </Typography>
                </div>
            </div>
        );
    } else if (showSpinning) {
        return (
            <div className={classes.spinnerBox}>
                <div>
                    <CircularProgress/>
                </div>
            </div>
        );
    } else if (showNoClubs) {

        return (
            <div className={classes.root}>
                <div className={classes.contentMessage}>
                    <Typography className={classes.message} variant="body1" component="div">
                        {intl.formatMessage({ id: 'StudentClubs.noClubs'})}
                    </Typography>
                    <div className={classes.addContactButtonBox}>
                        <Button className={classes.addContactButton} color='secondary' onClick={onAddContact}>
                            {intl.formatMessage({id: 'StudentClubs.addClub'})}
                        </Button>
                    </div> 
                </div>
                {editClubContext.show && (
                    <EditClub context={editClubContext} onClose={onCloseEditClub}/>
                )}
            </div>
        );
    } else if (payload &&  payload?.studentClubs?.length > 0) {     
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.contactsTableBox}>
                        <Table className={classes.contactsTable} stickyHeader={true}>
                            <TableHead>
                                <TableRow className={classes.leaveTableRow}>
                                    <TableCell align="left" padding={'none'}>
                                        <Typography variant={'body2'} component={'div'}>
                                            { 'The club activities you are member in the current term : '} { payload?.currentTerm}
                                        </Typography>
                                    </TableCell> 
                                </TableRow>
                                <TableRow className={classes.leaveTableRow}>
                                    <TableCell align="left" padding={'none'}>{intl.formatMessage({id: 'StudentClubs.desc'})}</TableCell>                                   
                                   
                                    <TableCell align="right" padding={'none'}>
                                        <IconButton
                                            className={classes.addButton}
                                            color="gray"
                                            aria-label="Add"
                                            onClick={() => onAddContact()}
                                        >
                                            <Icon name="add" />
                                        </IconButton>
                                    </TableCell>
                                    
                                </TableRow>
                            </TableHead>

                            <TableBody>
                               
                                {payload.studentClubs.map((club, index) => {                               
                                    return (
                                        <TableRow key={index} className={classes.contactsTableRow}>
                                        
                                            <TableCell align="left" padding={'none'}>
                                                <Typography variant={'body3'} component={'div'}>
                                                    { club ? club.stvactcDesc : 'unknown' }
                                                </Typography>
                                            </TableCell>
                                            
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {editClubContext.show && (
                    <EditClub context={editClubContext} onClose={onCloseEditClub}/>
                )}
              
                <Snackbar
                    open={showSnackbar}
                    message={snackMessage}
                    onClose={() => { setShowSnackbar(false); }}
                />
                {busy && (
                    <div
                        className={classes.busyBox}
                        onClick={(event) => {event.stopPropagation();}}
                        onKeyUp={(event) => {event.stopPropagation();}}
                        role='button'
                        tabIndex={0}
                    >
                        <CircularProgress/>
                    </div>
                )}
            </div>
        );
    }
}

function StudentClubsWithProviders() {
    
    const options = useMemo(() => ({
        queryFunction: userTokenDataConnectQuery,
        resource: process.env.PIPELINE_GET_STUDENT_CLUBS
    }
    ), []);

    return (
        <DataQueryProvider options={options}>
            <StudentClubs/>
        </DataQueryProvider>
    );
}

export default withIntl(StudentClubsWithProviders);