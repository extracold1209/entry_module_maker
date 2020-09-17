import React, {useCallback, useState} from "react";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

type IProps = {
    value: string;
    onFileChanged?: (name: string, path: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mr: {
            marginRight: theme.spacing(1)
        },
        flex: {
            display: 'flex'
        },
    }),
);

const FileInput: React.FC<IProps> = (props) => {
    const classes = useStyles();
    const {value, onFileChanged} = props;
    const [selectedFilePath, setFilepath] = useState('');

    const handleFileInputChanged = useCallback((e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const {name, path} = selectedFile;
            setFilepath(path);
            onFileChanged?.(name, path);
        }
    }, []);

    return (
        <Box className={classes.flex}>
            <input
                hidden
                accept="*/*"
                type="file"
                id={`${value}-input`}
                onChange={handleFileInputChanged}
            />
            <label htmlFor={`${value}-input`}>
                <Button variant="contained" color="primary" component="span" className={classes.mr}>
                    {value}
                </Button>
            </label>
            <Input
                disabled
                className={classes.flex}
                style={{width: '100%'}}
                value={selectedFilePath}
            />
        </Box>
    )
}

export default FileInput;
