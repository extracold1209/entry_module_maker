import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "./IconTextField";
import Divider from "@material-ui/core/Divider";
import ContentsContainer from "./ContentsContainer";
import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divider: {
            marginBottom: theme.spacing(1),
        },
    }),
);

const MainContainer: React.FC = () => {
    const classes = useStyles();
    return (
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
            <Divider className={classes.divider}/>
            <ContentsContainer/>
        </Container>
    );
}

export default MainContainer;
