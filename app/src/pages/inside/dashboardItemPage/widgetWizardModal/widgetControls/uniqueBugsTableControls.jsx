import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues, initialize } from 'redux-form';
import { FieldProvider } from 'components/fields/fieldProvider';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { validate } from 'common/utils';
import { ITEMS_INPUT_WIDTH } from './constants';
import { FiltersControl, InputControl } from './controls';
import { WIDGET_WIZARD_FORM } from '../widgetWizardContent/wizardControlsSection/constants';

const DEFAULT_ITEMS_COUNT = '10';
const messages = defineMessages({
  ItemsFieldLabel: {
    id: 'UniqueBugsTableControls.ItemsFieldLabel',
    defaultMessage: 'Maximum launches in selection',
  },
  ItemsValidationError: {
    id: 'UniqueBugsTableControls.ItemsValidationError',
    defaultMessage: 'Items count should have value from 1 to 150',
  },
});
const validators = {
  items: (formatMessage) => (value) =>
    (!value || !validate.widgetItems(value, 1, 150)) &&
    formatMessage(messages.ItemsValidationError),
};

@injectIntl
@connect(
  (state) => ({
    widgetSettings: getFormValues(WIDGET_WIZARD_FORM)(state),
  }),
  {
    initializeWizardSecondStepForm: (data) =>
      initialize(WIDGET_WIZARD_FORM, data, true, { keepValues: true }),
  },
)
export class UniqueBugsTableControls extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    widgetSettings: PropTypes.object.isRequired,
    initializeWizardSecondStepForm: PropTypes.func.isRequired,
    formAppearance: PropTypes.object.isRequired,
    onFormAppearanceChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { widgetSettings, initializeWizardSecondStepForm } = props;
    initializeWizardSecondStepForm({
      itemsCount: widgetSettings.itemsCount || DEFAULT_ITEMS_COUNT,
    });
  }

  parseItems = (value) => (value.length < 4 ? value : this.props.widgetSettings.itemsCount);

  render() {
    const { intl, formAppearance, onFormAppearanceChange } = this.props;
    return (
      <Fragment>
        <FieldProvider name={'filterId'}>
          <FiltersControl
            formAppearance={formAppearance}
            onFormAppearanceChange={onFormAppearanceChange}
          />
        </FieldProvider>
        <FieldProvider
          name="itemsCount"
          validate={validators.items(intl.formatMessage)}
          parse={this.parseItems}
        >
          <InputControl
            fieldLabel={intl.formatMessage(messages.ItemsFieldLabel)}
            inputWidth={ITEMS_INPUT_WIDTH}
            type="number"
          />
        </FieldProvider>
      </Fragment>
    );
  }
}