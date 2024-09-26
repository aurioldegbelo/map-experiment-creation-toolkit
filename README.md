# A Toolkit for the Creation of Online Experiments Evaluating Choropleth Maps

This toolkit aims for automating the creation on online experiments for evaluating the user experience of choropleth maps.

## Documentation

### Experiment

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| **title** | string | mandatory | - | The title of the experiment. It is always visible at the top of the page. |
| description | string | optional | `""` | The description of the experiment. This only serves as metadata to identify an experiment (optional). |
| **authors** | [Author](#author)[] | mandatory | - | A list of experiment authors. Define atleast one author. Refer to the [Author](#author) section for details.  |
| measureTaskCompletionTime | boolean | optional | `false` | Set this to `true` to enable the automatic measurement of the time a participant takes to perform a task. 
| enableRestart | boolean | optional | `true` | By default a button in the task navigation bar is shown to restart the experiment from the beginning. Set this to `false` to prevent participants from restarting an experiment.
| **tasks** | [Task](#task)[] | mandatory | - | A list of tasks to be included in this experiment. Define atleast one task. Refer to the [Task](#task) section for details. |

### Author

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| title | string | optional | `""` | The author's academic title (optional). |
| firstName | string | mandatory | - | The author's first name. |
| lastName | string | mandatory | - | The author's last name. |
| email | string | mandatory | - | The author's contact email address according to the [RFC 5321 specification](https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2) (e.g. `email@example.com`).  |

### Task

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| title | string | optional | `""` | The title of the task (optional). It will appear in the task navigation bar and at the top of the task's page. |
| **widgets** | [Widget](#widget)[] | mandatory | - | A number of widgets for the task. Specify atleast one widget. Refer to the [Widget](widget) section to learn more. |

### Widget

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| **type** | string | mandatory | - | The type of the widget to create. Can be one of `"TEXT"`, `"INPUT` or `"MAP"`. |
| **properties** | [TextWidgetProperties](#textwidgetproperties) \| [InputWidgetProperties](#inputwidgetproperties) \| [MapWidgetProperties](#mapwidgetproperties) | mandatory | - | Additional properties of the widget, depending on the seletcted type. |

### TextWidgetProperties

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| heading | string | optional | "" | You can optionally specify a heading, that describes a block of text. It appears as bold text over the text block. |
| **text** | string | mandatory | - |  The text that should appear in the text block. |

### InputWidgetProperties

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| **type** | string | mandatory | - | The type of the input field to create. Can be one of `"TEXT"` or `"LIKERT"`.
| **question** | string | mandatory | - | The question or task that should be answered by the participant using the provided input field. |
| **properties** | [TextInputWidgetProperties](#textinputwidgetproperties) \| [LikertInputWidgetProperties](#likertinputwidgetproperties) | mandatory | - | Additional properties of the input widget. |

### TextInputWidgetProperties

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| **singleLine** | boolean | mandatory | - | Specifies if the text input field should be a single-line text field or a multi-line text area. |
| minLength | integer | optional | 0 | The minimum amount of characters required in the text field or text area. If not specified, the minimum amount of characters is zero. |
| maxLength | integer | optional | ∞ | The maximum amount of characters allowed in the text field or text area. If not specified, the maximum amount of characters is unlimited. |
| type | string | optional | "text" | The type of characters allowed in the text field. Can be either `"text"` or `"number"`. Only applies to single-line text fields.

### LikertInputWidgetProperties

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| **items** | string[] | mandatory | - | A list of possible Likert items the participant can choose. The specified string of a Likert item relates to the label appearing next to the radio button. The order of the scale is based on the ordering of the provided list. You may specify either 5 or 7 likert items. Each item must be unqiue.

### MapWidgetProperties

| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| title | string | optional | "" | The title of the map (optional). |
| **data** | [MapData](#mapdata) | mandatory | - | The data to be visualized by the map. Refer to [MapData](#mapdata) for details. |
| **classificationMethod** | string | mandatory | - | The method or algorithm used to classify the data. Can be one of `"EQUAL_INTERVAL"`, `"JENKS"` or `"QUANTILES"`. For details on the algorithms used refer to the [geostats documentation](https://www.intermezzo-coop.eu/mapping/geostats/). |
| **colorScheme** | uri | mandatory | - | A string, representing the URL to the color scheme generated by [ColorBrewer](https://colorbrewer2.org), e.g. `"https://colorbrewer2.org/?type=sequential&scheme=OrRd&n=3"`. Refer to the [How-To]() section to learn how to generate a color scheme using ColorBrewer. |

### MapData
| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| **source** | string | mandatory | - | The file name of the data to be visualized. You do not need to specify a whole file path, in case you put the file in the default data directory. Currently, only GeoJSON files are being supported. For example: `"LakeCounty_Health_NationalObesityByState_2015"` |
| **variable** | [Variable](#variable) | mandatory | - | The measured variable in the data to be visualized by the map. Refer to [Variable](#variable) for details. |
| attribution | [Attribution](#attribution) | optional | - | The attribution, containing the data's metadata. Refer to [Attribution](#attribution) for details. |

### Variable
| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| **id** | string | mandatory | - | The name of the variable provided in the dataset. See the [example](#example) below. |
| label | string | optional | "" | An alternative label for the variable in case the default name is not meaningful. The label is displayed in the map's legend for example. |
| unit | string | optional | "" | The unit of the variable. This is displayed in the map's legend for example. By default, no unit is being provided with the data. | 

#### Example 
Consider the following snippet from an example dataset:

```json
"properties": {
    "OBJECTID": 1,
    "NAME": "Texas",
    "VALUE": 32.4
}
```
If you want to visualize the variable `"VALUE"`, you have to specify the `id` as `"VALUE"`. Since the variable name is not very meaningful in this case, you can use an alternative label by providing the `label` property (e.g. `"Obesity"`). Since there is no unit being provided you can specify the `unit` property as well (e.g. `"%"`) to improve the description of your data.


### Attribution
| Property | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| **url** | uri | mandatory | - | A string, representing the URL to the metadata of the provided dataset. |
| **label** | string | mandatory | - | The label to be displayed in the attribution (e.g. the name of the data provider). |