import * as React from 'react'
import Select from 'react-select'
import { IFieldProps } from './Fields'
import { Styles } from 'react-select/lib/styles'
import { Props as SelectProps } from 'react-select/lib/Select'
import { FieldContainer } from './elements'
import theme from 'src/themes/styled.theme'
import ReactFlagsSelect from 'react-flags-select'
import { getCountryName } from 'src/utils/helpers'
import { background } from 'styled-system'

interface ISelectOption {
  value: string
  label: string
}
interface ISelectFieldProps extends IFieldProps, SelectProps {
  options?: ISelectOption[]
  placeholder?: string
  style?: React.CSSProperties
}

// TODO - better bind the above input styles to the react-select component
// (currently implements its own styling with following overrides)
export const SelectStyles: Partial<Styles> = {
  container: (provided, state) => ({
    ...provided,
    fontSize: theme.fontSizes[1] + 'px',
    marginBottom: theme.space[2] + 'px',
    fontFamily: "'Inter', Arial, sans-serif",
  }),
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #dce4e5',
    backgroundColor: theme.colors.background,
    minHeight: '40px',
    boxShadow: 'none',
    ':focus': {
      border: '1px solid #83ceeb',
      outline: 'none',
    },
    ':hover': {
      border: '1px solid #83ceeb',
    },
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: theme.colors.background,
    boxShadow: 'none',
    ':hover': {
      outline: 'none',
      backgroundColor: 'white',
      color: 'black',
    },
  }),

  menu: (provided, state) => ({
    ...provided,
    border: '1px solid #dce4e5',
    boxShadow: 'none',
    backgroundColor: theme.colors.background,
    ':hover': {
      border: '1px solid #dce4e5',
    },
  }),

  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: '#e2edf7',
    padding: '2px',
    border: '1px solid #c2d4e4',
    color: '#61646b',
  }),

  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: 'none',
  }),
}

// annoyingly react-final-form saves the full option as values (not just the value field)
// therefore the following two functions are used for converting to-from string values and field options

// depending on select type (e.g. multi) and option selected get value
function getValueFromSelect(
  v: ISelectOption | ISelectOption[] | null | undefined,
) {
  return v ? (Array.isArray(v) ? v.map(el => el.value) : v.value) : v
}

// given current values find the relevant select options
function getValueForSelect(
  opts: ISelectOption[] = [],
  v: string | string[] | null | undefined,
) {
  function findVal(optVal: string) {
    return opts.find(o => o.value === optVal)
  }
  return v
    ? Array.isArray(v)
      ? v.map(optVal => findVal(optVal) as ISelectOption)
      : findVal(v)
    : null
}

const defaultProps: Partial<ISelectFieldProps> = {
  getOptionLabel: (option: ISelectOption) => option.label,
  getOptionValue: (option: ISelectOption) => option.value,
  options: [],
}
export const SelectField = ({ input, meta, ...rest }: ISelectFieldProps) => (
  // note, we first use a div container so that default styles can be applied
  <FieldContainer>
    <Select
      styles={SelectStyles}
      onChange={v => {
        input.onChange(getValueFromSelect(v))
      }}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      value={getValueForSelect(rest.options, input.value)}
      {...defaultProps}
      {...rest}
    />
  </FieldContainer>
)

export const FlagSelector = ({ input, meta, ...rest }: ISelectFieldProps) => (
  <>
    <ReactFlagsSelect
      onSelect={v => {
        input.onChange(getCountryName(v))
      }}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      {...defaultProps}
      {...rest}
    />

    {/* {meta.error && meta.touched && <span>{meta.error}</span>} */}
  </>
)
