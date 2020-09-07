import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import FileInput from "./FileInput";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                marginBottom: theme.spacing(2),
            },
        },
    }),
);

const ContentsContainer: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <FileInput
                value={'HardwareJson'}
            />
            <FileInput
                value={'BlockFile'}
            />
        </div>
    );
}

export default ContentsContainer;
