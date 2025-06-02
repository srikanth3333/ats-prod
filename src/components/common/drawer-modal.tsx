import { Drawer } from "antd";
import React from "react";

interface DrawerModalProps {
  title: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  className?: any;
}

const DrawerModal: React.FC<DrawerModalProps> = ({
  title,
  children,
  onClose,
  className,
  open,
}) => {
  return (
    <>
      <Drawer
        title={title}
        width={className ? className : 920}
        onClose={onClose}
        open={open}
        className={className}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        {children}
      </Drawer>
    </>
  );
};

export default DrawerModal;
