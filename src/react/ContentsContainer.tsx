import React, {useCallback, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import FileInput from "./FileInput";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                marginBottom: theme.spacing(2),
            },
        },
        divider: {
            marginBottom: theme.spacing(1),
        },
        errorSpan: {
            color: 'red',
            userSelect: 'none'
        }
    }),
);

const ContentsContainer: React.FC = () => {
    const classes = useStyles();
    const [hardwareInfo, setHardwareInfo] = useState<any>();
    const [blockInfo, setBlockInfo] = useState<any>();
    const [errorText, setErrorText] = useState('ㅋㅋ루삥뽕');

    const handleFileChanged = useCallback((type: 'hardware' | 'block') => async (name: string, path: string) => {
        try {
            if (type === 'hardware') {
                if (path.endsWith('json')) {
                    const fileInfo = await global.getHardwareJsonInfo(path);
                    setHardwareInfo(fileInfo);
                    setErrorText('');
                } else {
                    setErrorText('Invalid file selected.')
                }
            } else if (type === 'block') {
                if (path.endsWith('js')) {
                    const fileInfo = await global.getBlockJsInfo(path);
                    setBlockInfo(fileInfo);
                    setErrorText('');
                } else {
                    setErrorText('Invalid file selected.')
                }
            }
        } catch (e) {
            console.warn(e);
            setErrorText('Invalid file selected.')
        }
    }, []);

    return (
        <div className={classes.root}>
            <FileInput
                value={'HardwareJson'}
                onFileChanged={handleFileChanged('hardware')}
            />
            <FileInput
                value={'BlockFile'}
                onFileChanged={handleFileChanged('block')}
            />
            <Divider className={classes.divider}/>
            <span className={classes.errorSpan}>{errorText}</span>
            <p>{hardwareInfo && JSON.stringify(hardwareInfo)}</p>
            <p>{blockInfo && JSON.stringify(blockInfo)}</p>
        </div>
    );
}

export default ContentsContainer;
