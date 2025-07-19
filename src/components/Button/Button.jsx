import styles from './Button.module.scss'

import classNames from "classnames/bind";
import { Link } from "react-router";
import PropTypes from 'prop-types';

const cx = classNames.bind(styles)

function Button({
    to,
    href, //link
    // button types
    primary = false,
    secondary = false,
    outline = false,
    disabled = false,
    disabledText = false,
    rounded = false,
    rounded_sm = false,
    // button size
    small = false,
    large = false,
    className,
    // icon button
    leftIcon,
    rightIcon,
    children,
    onClick,
    ...passProps // pass event
}) {
    let Comp = 'button'
    const props = {
        onClick,
        ...passProps
    }

    // remove event listener when disabled
    if (disabled) {
        // delete props.onClick
        Object.keys(props).forEach(key => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key]
            }
        })
    }

    // chuyển đổi thẻ 'a' và Link
    if (to) {
        props.to = to
        Comp = Link
    } else if (href) {
        props.href = href
        Comp = 'a'
    }

    const classes = cx('wrapper', {
        [className]: className, // truy cập thuộc tính
        primary,
        secondary,
        outline,
        disabled,
        disabledText,
        rounded,
        rounded_sm,
        small,
        large
    })

    return (
        <>
            <Comp className={classes} {...props}>
                {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
                <span className={cx('title')}>{children}</span>
                {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
            </Comp>
        </>
    )
}

Button.propTypes = {
    children: PropTypes.node.isRequired,  // bắt buột truyền prop
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    outline: PropTypes.bool,
    disabled: PropTypes.bool,
    rounded: PropTypes.bool,
    rounded_sm: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onClick: PropTypes.func,
}

export default Button;