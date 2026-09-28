export default function StarBorder({
  as: Element = 'button',
  className = '',
  color = '#7ce6ff',
  speed = '5s',
  children,
  ...props
}) {
  const { style: customStyle, ...elementProps } = props;
  const style = {
    ...customStyle,
    '--star-border-color': color,
    '--star-border-speed': speed,
  };

  return (
    <Element className={`star-border ${className}`} style={style} {...elementProps}>
      <span className="star-border-content">{children}</span>
    </Element>
  );
}
