import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { withSorting } from 'controllers/sorting';
import { PageLayout } from 'layouts/pageLayout';
import { LaunchSuiteGrid } from 'pages/inside/common/launchSuiteGrid';
import { SuiteTestToolbar } from 'pages/inside/common/suiteTestToolbar';
import {
  testsSelector,
  selectedTestsSelector,
  toggleTestSelectionAction,
  unselectAllTestsAction,
  testPaginationSelector,
  toggleAllTestsAction,
} from 'controllers/test';
import { withPagination } from 'controllers/pagination';
import { PaginationToolbar } from 'components/main/paginationToolbar';
import {
  fetchTestItemsAction,
  parentItemSelector,
  loadingSelector,
  namespaceSelector,
  DEFAULT_SORTING,
} from 'controllers/testItem';

@connect(
  (state) => ({
    tests: testsSelector(state),
    selectedTests: selectedTestsSelector(state),
    parentItem: parentItemSelector(state),
    loading: loadingSelector(state),
  }),
  {
    toggleTestSelectionAction,
    unselectAllTestsAction,
    toggleAllTestsAction,
    fetchTestItemsAction,
  },
)
@withSorting({
  defaultSorting: DEFAULT_SORTING,
  namespaceSelector,
})
@withPagination({
  paginationSelector: testPaginationSelector,
  namespaceSelector,
})
@injectIntl
export class TestsPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tests: PropTypes.arrayOf(PropTypes.object),
    selectedTests: PropTypes.arrayOf(PropTypes.object),
    activePage: PropTypes.number,
    itemCount: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    sortingColumn: PropTypes.string,
    sortingDirection: PropTypes.string,
    fetchTestItemsAction: PropTypes.func,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onChangeSorting: PropTypes.func,
    toggleTestSelectionAction: PropTypes.func,
    unselectAllTestsAction: PropTypes.func,
    toggleAllTestsAction: PropTypes.func,
    parentItem: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    tests: [],
    selectedTests: [],
    activePage: 1,
    itemCount: null,
    pageCount: null,
    pageSize: null,
    sortingColumn: null,
    sortingDirection: null,
    fetchTestItemsAction: () => {},
    onChangePage: () => {},
    onChangePageSize: () => {},
    onChangeSorting: () => {},
    toggleTestSelectionAction: () => {},
    unselectAllTestsAction: () => {},
    toggleAllTestsAction: () => {},
    parentItem: null,
    loading: false,
  };

  handleAllTestsSelection = () => this.props.toggleAllTestsAction(this.props.tests);

  render() {
    const {
      tests,
      sortingColumn,
      sortingDirection,
      onChangeSorting,
      selectedTests,
      activePage,
      itemCount,
      pageCount,
      pageSize,
      onChangePage,
      onChangePageSize,
      parentItem,
      loading,
    } = this.props;
    return (
      <PageLayout>
        <SuiteTestToolbar
          selectedItems={selectedTests}
          parentItem={parentItem}
          onUnselect={this.props.toggleTestSelectionAction}
          onUnselectAll={this.props.unselectAllTestsAction}
          onRefresh={this.props.fetchTestItemsAction}
        />
        <LaunchSuiteGrid
          data={tests}
          sortingColumn={sortingColumn}
          sortingDirection={sortingDirection}
          onChangeSorting={onChangeSorting}
          selectedItems={selectedTests}
          onItemSelect={this.props.toggleTestSelectionAction}
          onAllItemsSelect={this.handleAllTestsSelection}
          loading={loading}
        />
        <PaginationToolbar
          activePage={activePage}
          itemCount={itemCount}
          pageCount={pageCount}
          pageSize={pageSize}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
        />
      </PageLayout>
    );
  }
}
