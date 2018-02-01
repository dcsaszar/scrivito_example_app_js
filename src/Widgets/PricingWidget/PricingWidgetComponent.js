
function PlanButton({ target, className }) {
  const text = target && target.title();

  return (
    <Scrivito.LinkTag to={ target } className={ `btn ${className}` }>
      { text }<i className="fa fa-angle-right fa-4" aria-hidden="true" />
    </Scrivito.LinkTag>
  );
}

Scrivito.provideComponent('PricingWidget', ({ widget }) => {
  const currency = widget.get('currency') || '$';

  return (
    <div className="row charts">
      <div className="col-md-4">
        <div className="chart first">
          <Scrivito.ContentTag
            content={ widget }
            attribute="smallPlanName"
            className="plan-name"
          />
          <div className="quantity">
            <span className="dollar">{ currency }</span>
            <Scrivito.ContentTag
              content={ widget }
              attribute="smallPlanPrice"
              className="price"
              tag="span"
            />
            <Scrivito.ContentTag
              content={ widget }
              attribute="smallPlanPeriod"
              className="period"
              tag="span"
            />
          </div>
          <Scrivito.ContentTag content={ widget } attribute="smallPlanSpecs" className="specs" />
          <PlanButton target={ widget.get('smallPlanButton') } className="btn-default" />
        </div>
      </div>

      <div className="col-md-4">
        <div className="chart featured">
          <Scrivito.ContentTag
            content={ widget }
            attribute="mediumPlanName"
            className="plan-name"
          />
          <div className="quantity">
            <span className="dollar">{ currency }</span>
            <Scrivito.ContentTag
              content={ widget }
              attribute="mediumPlanPrice"
              className="price"
              tag="span"
            />
            <Scrivito.ContentTag
              content={ widget }
              attribute="mediumPlanPeriod"
              className="period"
              tag="span"
            />
          </div>
          <Scrivito.ContentTag
            content={ widget } attribute="mediumPlanSpecs" className="specs" />
          <PlanButton target={ widget.get('mediumPlanButton') } className="btn-primary" />
        </div>
      </div>
      <div className="col-md-4">
        <div className="chart last">
          <Scrivito.ContentTag content={ widget } attribute="largePlanName" className="plan-name"/>
          <div className="quantity">
            <span className="dollar">{ currency }</span>
            <Scrivito.ContentTag
              content={ widget }
              attribute="largePlanPrice"
              className="price"
              tag="span"
            />
            <Scrivito.ContentTag
              content={ widget }
              attribute="largePlanPeriod"
              className="period"
              tag="span"
            />
          </div>
          <Scrivito.ContentTag content={ widget } attribute="largePlanSpecs" className="specs" />
          <PlanButton target={ widget.get('largePlanButton') } className="btn-default" />
        </div>
      </div>
    </div>
  );
});