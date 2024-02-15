import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import PropTypes from "prop-types";

export default class ModalDropdownComp extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    multipleSelect: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    saveScrollPosition: PropTypes.bool,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,
    accessible: PropTypes.bool,
    animated: PropTypes.bool,
    isFullWidth: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.string,
    showSearch: PropTypes.bool,
    keySearchObject: PropTypes.string,
    renderSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    searchInputStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array,
    ]),
    searchPlaceholder: PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array,
    ]),
    textStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array,
    ]),
    defaultTextStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array,
    ]),
    dropdownStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array,
    ]),
    dropdownTextStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array,
    ]),
    dropdownTextHighlightStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array,
    ]),
    dropdownListProps: PropTypes.object,
    dropdownTextProps: PropTypes.object,
    adjustFrame: PropTypes.func,
    renderRow: PropTypes.func,
    renderRowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    renderRowProps: PropTypes.object,
    renderSeparator: PropTypes.func,
    renderButtonText: PropTypes.func,
    renderRowText: PropTypes.func,
    renderButtonComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]),
    renderRightComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]),
    renderButtonProps: PropTypes.object,
    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func,
    numberOfLines: PropTypes.number,
  };

  static defaultProps = {
    disabled: false,
    multipleSelect: false,
    scrollEnabled: true,
    saveScrollPosition: true,
    defaultIndex: -1,
    defaultValue: "Please select...",
    animated: true,
    isFullWidth: false,
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: "never",
    showSearch: false,
    searchPlaceholder: "Search....",
    keySearchObject: "label",
    renderRowComponent:
      Platform.OS === "ios" ? TouchableOpacity : TouchableHighlight,
    renderButtonComponent: TouchableOpacity,
    renderRightComponent: View,
    numberOfLines: 1,
  };

  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this.state = {
      accessible: !!props.accessible,
      loading: !props.options,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex,
      options: props.options,
      searchValue: "",
      searchVisible: false,
      optionsData: props.options,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    let { selectedIndex, loading } = state;
    const { defaultIndex, defaultValue, options } = nextProps;
    let newState = null;

    if (selectedIndex < 0) {
      selectedIndex = defaultIndex;
      newState = {
        selectedIndex: selectedIndex,
      };
      if (selectedIndex < 0) {
        newState.buttonText = defaultValue;
      }
    }

    if (!loading !== !options) {
      if (!newState) {
        newState = {};
      }
      newState.loading = !options;
    }
    if (options !== state.options) {
      newState.options = options;
      newState.optionsData = options;
    }

    return newState;
  }

  render() {
    return (
      <View {...this.props}>
        {this._renderButton()}
        {this._renderModal()}
      </View>
    );
  }

  _updatePosition(callback) {
    if (this?._button?.measure && callback) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = {
          x: px,
          y: py,
          w: width,
          h: height,
        };
        callback();
      });
    }
  }

  show() {
    this._updatePosition(() => {
      this.setState({
        showDropdown: true,
      });
    });
  }

  hide() {
    this.setState({
      showDropdown: false,
      searchValue: "",
      optionsData: [...this.state.options],
    });
  }

  _renderButton() {
    const {
      disabled,
      accessible,
      children,
      renderButtonComponent,
      renderButtonProps,
    } = this.props;
    const ButtonTouchable = renderButtonComponent;
    return (
      <ButtonTouchable
        ref={(button) => (this._button = button)}
        disabled={disabled}
        accessible={accessible}
        onPress={this._onButtonPress}
        {...renderButtonProps}
      >
        {children}
      </ButtonTouchable>
    );
  }

  _onButtonPress = () => {
    const { onDropdownWillShow } = this.props;

    if (!onDropdownWillShow || onDropdownWillShow() !== false) {
      this.show();
    }
  };
  _renderModal() {
    const { animated, accessible, dropdownStyle, modalVisible,popupHeight=0 } = this.props;
    const { showDropdown } = this.state;

    if (showDropdown && this._buttonFrame) {
      const frameStyle = this._calcPosition();
      const animationType = animated ? "fade" : "none";

      return (
        <Modal
          animationType={animationType}
          visible={modalVisible}
          transparent
          onRequestClose={this._onRequestClose}
          supportedOrientations={[
            "portrait",
            "portrait-upside-down",
            "landscape",
            "landscape-left",
            "landscape-right",
          ]}
        >
          <TouchableWithoutFeedback
            accessible={accessible}
            disabled={false}
            onPress={this._onModalPress}
          >
            <View style={styles.modal}>
              <View style={[styles.dropdown,popupHeight && {  height: (popupHeight + StyleSheet.hairlineWidth) * 5,}, dropdownStyle, frameStyle]}>
                {this._renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  _calcPosition() {
    const { dropdownStyle, style, adjustFrame, isFullWidth ,popupHeight =0 } = this.props;
    const dimensions = Dimensions.get("window");
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;
    const dropdownHeight =
      (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
      popupHeight || StyleSheet.flatten(styles.dropdown).height;
    const bottomSpace =
      windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    const rightSpace = windowWidth - this._buttonFrame.x;
    const showInBottom =
      bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
    const showInLeft = rightSpace >= this._buttonFrame.x;
    const positionStyle = {
      height: dropdownHeight,
      top: showInBottom
        ? this._buttonFrame.y + this._buttonFrame.h
        : Math.max(0, this._buttonFrame.y - dropdownHeight),
    };

    if (showInLeft) {
      positionStyle.left = this._buttonFrame.x;
      if (isFullWidth) {
        positionStyle.right = rightSpace - this._buttonFrame.w;
      }
    } else {
      const dropdownWidth =
        (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
        (style && StyleSheet.flatten(style).width) ||
        -1;

      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }

      positionStyle.right = rightSpace - this._buttonFrame.w;
    }

    return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
  }

  _onRequestClose = () => {
    const { onDropdownWillHide } = this.props;
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _onModalPress = () => {
    const { onDropdownWillHide } = this.props;
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.hide();
    }
    this.props.onClose();
  };

  _renderRowSearchText = (option, searchKeys, rowData) => {
    let condition = [];
    searchKeys.forEach((obj) => {
      condition.push(
        option?.[obj]?.toLowerCase().includes(rowData[obj].toLowerCase().trim())
      );
    });
    return condition.filter((data) => data == true).length == searchKeys.length;
  };

  _renderDropdown() {
    const {
      scrollEnabled,
      renderSeparator,
      showsVerticalScrollIndicator,
      keyboardShouldPersistTaps,
      dropdownListProps,
    } = this.props;
    const { optionsData } = this.state;
    return (
      <>
        <FlatList
          {...dropdownListProps}
          getItemLayout={(_, index) => {
            return {
              length: 33 + StyleSheet.hairlineWidth,
              index,
              offset: (33 + StyleSheet.hairlineWidth) * index,
            };
          }}
          data={optionsData}
          ref={(component) => (this.flatList = component)}
          scrollEnabled={scrollEnabled}
          style={styles.list}
          keyExtractor={(_, i) => `key-${i}`}
          renderItem={this._renderItem}
          ItemSeparatorComponent={renderSeparator || this._renderSeparator}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              this.flatList.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
        />
      </>
    );
  }
  _renderItem = ({ item, index }) => {
    const { renderRow, renderRowProps, accessible } = this.props;
    const { selectedIndex } = this.state;
    const key = `row_${index}`;
    const highlighted = index === selectedIndex;
    const touchableProps = {
      key,
      accessible,
      onPress: () => this._onRowPress(item, index),
      ...renderRowProps,
    };

    return (
      <TouchableOpacity {...touchableProps}>
        {renderRow(item, index, highlighted)}
      </TouchableOpacity>
    );
  };

  _onRowPress(rowData, rowID) {
    const {
      onSelect,
      renderButtonText,
      onDropdownWillHide,
      multipleSelect,
      keySearchObject,
      renderKeys,
    } = this.props;
    const { options } = this.state;
    let findIndexVal = -1,
      searchKeysData = renderKeys || [keySearchObject];

    if (options && options.length > 0) {
      findIndexVal = options.findIndex((obj) =>
        this._renderRowSearchText(obj, searchKeysData, rowData)
      );
    }
    if (!onSelect || onSelect(findIndexVal, rowData) !== false) {
      const value =
        (renderButtonText && renderButtonText(rowData)) || rowData.toString();
      this.setState({
        buttonText: value,
        selectedIndex: rowID,
      });
      this.setState({
        searchValue: "",
        optionsData: [...options],
        searchVisible: false,
      });
    }

    if (
      !multipleSelect &&
      (!onDropdownWillHide || onDropdownWillHide() !== false)
    ) {
      this.setState({
        showDropdown: false,
      });
    }
  }

  _renderSeparator = ({ leadingItem = "" }) => {
    const key = `spr_${leadingItem}`;

    return <View style={styles.separator} key={key} />;
  };
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  modal: {
    flexGrow: 1,
  },
  dropdown: {
    position: "absolute",
    height: (24 + StyleSheet.hairlineWidth) * 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    borderRadius: 6,
    backgroundColor: "#F3F5F8",
    justifyContent: "center",
    // marginHorizontal: 15,
  },
  list: {},
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "lightgray",
  },
});
