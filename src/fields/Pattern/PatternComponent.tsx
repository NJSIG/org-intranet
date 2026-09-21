'use client'

import { mergeFieldStyles } from '@/utilities/mergeFieldStyles'
import {
  fieldBaseClass,
  FieldDescription,
  FieldError,
  FieldLabel,
  RenderCustomComponent,
  useField,
} from '@payloadcms/ui'
import { NumberFieldClientProps, TextFieldClientProps } from 'payload'
import { useCallback, useMemo } from 'react'
import { PatternFormat, PatternFormatProps } from 'react-number-format'

//the component receives a pattern and a number or text field props. The pattern is used to format the value of the field.
type Props = { pattern: PatternFormatProps } & (NumberFieldClientProps | TextFieldClientProps)

//destructing -> instead of typing props.pattern, props.field, props.admin.className, etc. we can just type pattern, field, etc.
/* */
export const PatternComponent: React.FC<Props> = (props) => {
  const {
    path, //user.phone
    field,
    field: {
      type,
      admin: { className, description, placeholder, readOnly: adminReadOnly } = {}, // placeholder = (__)-___-____
      label, // phone number
      required,
    },
    readOnly,
    pattern,
    validate,
  } = props

  /* Validation */

  //useCallback() is a React hook that lets you cache a function definition between rerenders.
  //syntax: useCallback(fn, dependencies)
  const memoizedValidate = useCallback(
    //eslint-disable-nextline @typescript-eslint/no-explicit-any
    (value: null | (number[] & string) | undefined, options: any) => {
      if (typeof validate === 'function') {
        //this hooks returns a validation function
        //the wrapper simply injects required because the original validator might not know whether the field is required
        return validate(value, { ...options, required })
      }
    },
    [validate, required],
  )

  /* Styles - this computes the fields once, without the hook, every render would call merge field styles*/
  //useMemo() is a React hook that lets you cache the result of a computation between rerenders.
  //syntax: useMemo(calculatedValue, dependencies)
  const styles = useMemo(() => mergeFieldStyles(field), [field])

  /*Connecting to Payload */
  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {}, //allows the Payload users to override the pieces of the UI
    setValue, //updates the form (equivalent to setState )
    showError,
    value,
  } = useField<string>({
    path,
    validate: memoizedValidate,
  })

  /* Purpose: to convert what the user typed into the value Payload should actually store
    example: if field is $123.45, if the field type is number it should save as 123.45 and not "123.45" or "$123.45"
  */
  const formatValue = useCallback(
    (value: string) => {
      const prefix = pattern.prefix

      if (type === 'number') {
        let cleanValue: number | string = value
        /* $123.45 removes "$" so it turns into 123.45 */
        if (prefix) {
          cleanValue = cleanValue.replace(prefix, '')
        }

        cleanValue = parseFloat(cleanValue)

        return cleanValue
      } else {
        //if it is a text field, we just return the value as is, because we don't need to convert it to a number
        return value
      }
    },
    [type, pattern.prefix],
  )

  const isReadOnly = readOnly || adminReadOnly

  /* Rendering - JSX starts here */
  return (
    <div
      //className= means 'run this javaScript, and whatever string comes out becomes a className'
      //
      className={[fieldBaseClass, type, className, showError && 'error', readOnly && 'readOnly']
        .filter(Boolean)
        .join(' ')}
      style={styles}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={<FieldLabel label={label} path={path} required={required} />}
      />

      <div className={`${fieldBaseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />

        {BeforeInput}

        <PatternFormat
          className="field-pattern"
          id={`field-${path.replace(/\./g, '__')}`}
          name={path}
          onChange={(e) => {
            setValue(formatValue(e.target.value))
          }}
          placeholder={typeof placeholder === 'string' ? placeholder : ''}
          readOnly={isReadOnly}
          required={required}
          value={value}
        />

        {AfterInput}

        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={
            <FieldDescription
              className={`field-description-${path.replace(/\./g, '__')}`}
              description={description ?? ''}
              path={path}
            />
          }
        />
      </div>
    </div>
  )
}
