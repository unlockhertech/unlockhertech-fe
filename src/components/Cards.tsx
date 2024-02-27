import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export const Cards: React.FC = () => {
  return (
    <Card className="">
      <Card.Header className="mt-2 eachCardHeader">Education Library</Card.Header>
      <Card.Body className="eachCard">
        <Card.Title>Education</Card.Title>
        <Card.Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero molestiae fuga, dolores, tenetur vitae, recusandae aperiam ullam quam excepturi dicta omnis expedita fugiat maiores sed cupiditate blanditiis accusantium ex necessitatibus.
        </Card.Text>
        <Button variant="light">Go Education</Button>
      </Card.Body>


      <Card.Header className="eachCardHeader">Education Library</Card.Header>
   
      <Card.Header className="mt-2 eachCardHeader">Podcasts Library</Card.Header>
      <Card.Body className="eachCard">
        <Card.Title>Podcasts</Card.Title>
        <Card.Text>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum asperiores libero rerum, incidunt commodi vitae facilis iste, ullam sunt deserunt sit recusandae? Tempore nesciunt, iusto soluta fuga quod nam eveniet.
        </Card.Text>
        <Button variant="light">Go Podcasts</Button>
      </Card.Body>


      <Card.Header className="mt-2 eachCardHeader">Workshops Library</Card.Header>
      <Card.Body className="eachCard">
        <Card.Title>Workshops</Card.Title>
        <Card.Text>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate omnis recusandae aliquid eum iste! Ex odit asperiores molestiae, nam assumenda, ratione natus quasi omnis distinctio praesentium quis facilis eos voluptatibus.
        </Card.Text>
        <Button variant="light">Go Workshops</Button>
      </Card.Body>
      </Card>)

};
