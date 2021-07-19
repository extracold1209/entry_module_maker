import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import RadioGroup from './IconTextField';
import Divider from '@material-ui/core/Divider';
import HardwareContainer from './hardwareContainer';
import HardwareLiteContainer from './hardwareLiteContainer';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRecoilState } from 'recoil';
import { modeState } from './recoilAtoms/index';
import { useMemo } from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divider: {
            marginBottom: theme.spacing(1),
        },
    })
);

const MODE = [
    {
        text: '하드웨어',
        value: 'hardware',
    },
    {
        text: '하드웨어 라이트',
        value: 'hardwareLite',
    },
];

const MainContainer: React.FC = () => {
    const classes = useStyles();
    const [mode, setMode] = useRecoilState(modeState);
    const content = useMemo(() => {
        switch (mode) {
            case 'hardware':
                return <HardwareContainer />;
            case 'hardwareLite':
                return <HardwareLiteContainer />;
        }
    }, [mode]);
    return (
        <Container>
            <Typography variant="h3" component="h3">
                Entry Hardware Module Maker
            </Typography>
            <RadioGroup
                disabled={false}
                list={MODE}
                name="module-type"
                defaultValue={'hardware'}
                onChange={setMode}
            />
            <Divider className={classes.divider} />
            {content}
        </Container>
    );
};

export default MainContainer;
