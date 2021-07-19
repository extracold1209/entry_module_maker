import React, { ChangeEvent, useCallback, useState } from 'react';
import { isEmpty } from 'lodash';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FileInput from './FileInput';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

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
            userSelect: 'none',
        },
        textInput: {
            width: '100%',
        },
    })
);

const HardwareLiteContainer: React.FC = () => {
    const classes = useStyles();
    const [errorText, setErrorText] = useState('');
    const [blockInfo, setBlockInfo] = useState('');
    const [imageInfo, setImageInfo] = useState('');
    const [metadataInfo, setMetadataInfo] = useState('');
    const [moduleName, setModuleName] = useState('');
    const checkFileExt = useCallback((path: string, ext: string) => {
        if (!path.endsWith(ext)) {
            throw new Error();
        } else setErrorText('');
    }, []);
    const handleFileChanged = useCallback(
        (type: 'image' | 'block' | 'metadata') => async (name: string, path: string) => {
            try {
                const fileInfo = await global.getHardwareJsonInfo(path);
                switch (type) {
                    case 'image':
                        checkFileExt(path, 'png');
                        setImageInfo(path);
                        break;
                    case 'block':
                        checkFileExt(path, 'js');
                        setBlockInfo(path);
                        break;
                    case 'metadata':
                        checkFileExt(path, 'json');
                        setMetadataInfo(path);
                        break;
                }
            } catch (err) {
                console.warn(err);
                setErrorText('Invalid file selected.');
            }
        },
        []
    );

    const handleCreateClicked = useCallback(async () => {
        if (!blockInfo || !metadataInfo || !imageInfo || !moduleName) {
            alert('Parameter is insufficient');
        }
        console.log(imageInfo, blockInfo, metadataInfo, moduleName);
        await global.compressLiteModule({
            imageInfo,
            blockInfo,
            metadataInfo,
            moduleName,
        });
    }, [imageInfo, blockInfo, metadataInfo, moduleName]);
    const handleOpenDirectory = useCallback(() => {
        global.openBuildDirectory();
    }, []);
    return (
        <div className={classes.root}>
            <FileInput value={'image'} onFileChanged={handleFileChanged('image')} />
            <FileInput value={'block'} onFileChanged={handleFileChanged('block')} />
            <FileInput value={'metadata'} onFileChanged={handleFileChanged('metadata')} />
            <Grid container direction={'row'}>
                <Grid item xs={6}>
                    <TextField
                        label="ModuleName"
                        value={moduleName}
                        onChange={(e) => {
                            setModuleName(e.target.value);
                        }}
                        className={`${classes.textInput} ${classes.pr}`}
                    />
                </Grid>
            </Grid>
            <span className={classes.errorSpan}>{errorText}</span>
            <Divider className={classes.divider} />
            <Grid container justify={'flex-end'}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.mr}
                        onClick={handleCreateClicked}
                    >
                        Create
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleOpenDirectory}>
                        Open Directory
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default HardwareLiteContainer;
