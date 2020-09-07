import React, {ChangeEvent, useCallback, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import FileInput from "./FileInput";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                marginBottom: theme.spacing(2),
            },
        },
        divider: {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
        },
        pr: {
            paddingRight: theme.spacing(1),
        },
        mr: {
            marginRight: theme.spacing(1),
        },
        errorSpan: {
            color: 'red',
            userSelect: 'none'
        },
        textInput: {
            width: '100%',
        }
    }),
);

let blockFilePath = '';
let hardwareConfigPath = '';
const ContentsContainer: React.FC = () => {
    const classes = useStyles();
    const [hardwareInfo, setHardwareInfo] = useState<any>();
    const [blockInfo, setBlockInfo] = useState<any>();
    const [errorText, setErrorText] = useState('ㅋㅋ루삥뽕');
    const [moduleName, setModuleName] = useState('');
    const [version, setVersion] = useState('');

    const handleFileChanged = useCallback((type: 'hardware' | 'block') => async (name: string, path: string) => {
        try {
            if (type === 'hardware') {
                if (path.endsWith('json')) {
                    const fileInfo = await global.getHardwareJsonInfo(path);
                    setHardwareInfo(fileInfo);
                    hardwareConfigPath = path;
                    setModuleName(name.replace('.json', ''));
                    if (fileInfo.version) {
                        setVersion(fileInfo.version as string);
                    } else {
                        setVersion('0.0.1');
                    }

                    setErrorText('');
                } else {
                    setErrorText('Invalid file selected.')
                }
            } else if (type === 'block') {
                if (path.endsWith('js')) {
                    const fileInfo = await global.getBlockJsInfo(path);
                    blockFilePath = path;
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
    const handleTextChanged = useCallback((type: 'module' | 'version') => (e: ChangeEvent<HTMLInputElement>) => {
        if (type === 'module') {
            setModuleName(e.target.value);
        } else if (type === 'version') {
            setVersion(e.target.value);
        }
    }, []);
    const handleOpenDirectory = useCallback(() => {
        global.openBuildDirectory();
    }, []);
    const handleCreateClicked = useCallback(async () => {
        try {
            await global.compressModule({
                hardwareConfigPath,
                blockFilePath,
                moduleName,
                version
            });
            alert('Compress Success');
        } catch (e) {
            alert('Compress Failed');
        }
    }, [moduleName, version]);

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
            <Grid container direction={'row'}>
                <Grid item xs={6}>
                    <TextField label="ModuleName" value={moduleName} onChange={handleTextChanged('module')}
                               className={`${classes.textInput} ${classes.pr}`}/>
                </Grid>
                <Grid item xs={6} className={classes.textInput}>
                    <TextField label="Version" value={version} onChange={handleTextChanged('version')}
                               className={classes.textInput}/>
                </Grid>
            </Grid>
            <span className={classes.errorSpan}>{errorText}</span>
            <Divider className={classes.divider}/>
            <Grid container justify={'flex-end'}>
                <Grid item>
                    <Button variant="contained" color="primary" className={classes.mr}
                            onClick={handleCreateClicked}>Create</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleOpenDirectory}>Open Directory</Button>
                </Grid>
            </Grid>
            <p>{hardwareInfo && JSON.stringify(hardwareInfo)}</p>
            <p>{blockInfo && JSON.stringify(blockInfo)}</p>
        </div>
    );
}

export default ContentsContainer;
