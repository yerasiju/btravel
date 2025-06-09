const ContactInfo = () => {
  const contactContent = [
    {
      id: 1,
      title: "Toll Free Customer Care",
      action: "tel:+7 702 276 6797",
      text: "+7 702 276 6797",
    },
    {
      id: 2,
      title: "Need live support?",
      action: "mailto:b@btravel.com",
      text: "b@btravel.com",
    },
  ];
  return (
    <>
      {contactContent.map((item) => (
        <div className="mt-30" key={item.id}>
          <div className={"text-14 mt-30"}>{item.title}</div>
          <a href={item.action} className="text-18 fw-500 text-blue-1 mt-5">
            {item.text}
          </a>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
