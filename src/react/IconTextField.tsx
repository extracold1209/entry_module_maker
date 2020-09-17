import React, {useCallback} from "react";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

type IProps = {
    direction?: 'row' | 'column';
    formLabel?: string;
    name: string;
    list: string[];
    onChange?: (item: string) => void;
    defaultValue?: string;
    disabled?: boolean;
}

const FormControlLabelPlacement: React.FC<IProps> = (props) => {
    const {list, formLabel, direction = 'row', name, onChange, defaultValue, disabled} = props;

    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    }, [])

    return (
        <FormControl component="fieldset" disabled={disabled}>
            {
                formLabel && <FormLabel component="legend">{formLabel}</FormLabel>
            }
            <RadioGroup row={direction === 'row'} aria-label={name} name={name} onChange={handleOnChange}
                        defaultValue={defaultValue}>
                {
                    list.map((item) => (
                        <FormControlLabel key={item} value={item} control={<Radio color="primary"/>} label={item}/>
                    ))
                }
            </RadioGroup>
        </FormControl>
    );
}

export default FormControlLabelPlacement;
