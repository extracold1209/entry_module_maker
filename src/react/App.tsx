import React from 'react';
import ReactDom from 'react-dom';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import RadioGroup from "./IconTextField";
import FileInput from "./FileInput";

ReactDom.render(
    <Container>
        <Typography variant='h3' component='h3'>
            Entry Hardware Module Maker
        </Typography>
        <RadioGroup
            disabled={true}
            list={['하드웨어', '확장블록']}
            name='module-type'
            defaultValue={'하드웨어'}
        />
        <Divider/>
        <FileInput
            value={'HardwareJson'}
        />
        <FileInput
            value={'BlockFile'}
        />
    </Container>,
    document.getElementById('__root__'),
);
