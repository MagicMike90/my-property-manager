import React from 'react';
import './Search.css';
import { Icon, Button, Input, AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { searchTenants } from '../actions';
const Option = AutoComplete.Option;

function onSelect(value) {
  console.log('onSelect', value);
}

function renderOption(item) {
  return (
    <Option key={item.category} text={item.category}>
      {item.query} 在
      <a
        href={`https://s.taobao.com/search?q=${item.query}`}
        target="_blank"
        rel="noopener noreferrer">
        {item.category}
      </a>
      区块中
      <span className="global-search-item-count">约 {item.count} 个结果</span>
    </Option>
  );
}

class Search extends React.Component {
  state = {
    dataSource: [],
  };

  handleSearch = value => {
    // this.setState({
    //   dataSource: value ? searchResult(value) : [],
    // });
    const query = {
      field: 'name.firstName',
      value: value,
    };
    this.props.dispatch(searchTenants({ query }));
  };

  render() {
    const { dataSource } = this.state;
    return (
      <div className="global-search-wrapper" style={{ width: 300 }}>
        <AutoComplete
          className="global-search"
          size="large"
          style={{ width: '100%' }}
          dataSource={dataSource.map(renderOption)}
          onSelect={onSelect}
          onSearch={this.handleSearch}
          placeholder="input here"
          optionLabelProp="text">
          <Input
            suffix={
              <Button className="search-btn" size="large" type="primary">
                <Icon type="search" />
              </Button>
            }
          />
        </AutoComplete>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const {
    tenants,
    isFetching,
    lastUpdated,
    deletedTenants,
    pagination,
  } = state.tenant;

  return {
    tenants: tenants,
    isFetching: isFetching,
    lastUpdated: lastUpdated,
    deletedTenants: deletedTenants,
    pagination: pagination,
  };
};
export default withRouter(connect(mapStateToProps)(Search));
