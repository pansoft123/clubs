// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle ,Dropdown} from '@ellucian/react-design-system/core';

export default function EditClub({
    onClose = () => {},
    context = { show: false },
}) {
    const intl = useIntl();
    
    

    const { addContact, mode, show ,payload,clubLimit,clubFees} = context;
  
    const [ name, setName ] = useState();
    const [ term, setTerm ] = useState();
    const bannerId = payload?.bannerId;

    const onSave = useCallback(() => {
        if (mode === 'add') {
            addContact({ name ,term,bannerId,clubFees});
            onClose();
        } 
    }, [ addContact, onClose,mode, name ,term,bannerId,clubFees]);

    const title = useMemo(() => {
        if (mode === 'add') {
            return intl.formatMessage({id: 'StudentClubs.editClub.addTitle'});
        } else {
            return intl.formatMessage({id: 'StudentClubs.editClub.editTitle'});
        }
    }, [intl, mode]);
    
    if (payload?.studentClubs?.length > clubLimit){
        return(
            <Dialog
                open={show}
                onClose={onClose}
                fullWidth
            >   
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {intl.formatMessage({id: 'StudentClubs.editClub.limit'})}
                    </DialogContentText>
                </DialogContent> 
            </Dialog>
        );
    }
    
    else{
        return (
            <Dialog
                open={show}
                onClose={onClose}
                fullWidth
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {intl.formatMessage({id: 'StudentClubs.editClub.instructions'})}
                    </DialogContentText>
                
                    <Dropdown
                        label="Term"
                        value={term}
                        onChange={event => {
                            setTerm(event.target.value);
                        }}      
                        required
                        native
                    >
                        <option />
                        {payload?.Terms?.map(option => {
                            return (
                                <option key={option.code} value={option.code}>
                                    {option.desc}
                                </option>
                            );
                        })}
                    </Dropdown>
                    <br></br>
                    <Dropdown
                        label="Club List"
                        value={name}
                        onChange={event => {
                            setName(event.target.value);
                        }}      
                        required
                        native
                    >
                        <option />
                        {payload?.activityList?.map(option => {
                            return (
                                <option key={option.code} value={option.code}>
                                    {option.desc}
                                </option>
                            );
                        })}
                    </Dropdown>
                
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        {intl.formatMessage({id: 'StudentClubs.cancel'})}
                    </Button>
                    <Button
                        onClick={onSave}
                        color="primary"
                    >
                        {intl.formatMessage({id: 'StudentClubs.save'})}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

EditClub.propTypes = {
    cardInfo: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    context: PropTypes.object,
};



