"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreToyMapper = exports.XMLToyMapper = void 0;
const toy_builder_1 = require("../model/builders/toy.builder");
class XMLToyMapper {
    reverseMap() {
        throw new Error('Method not implemented.');
    }
    map(data) {
        return toy_builder_1.ToyBuilder.newBuilder()
            .setType(data[1])
            .setAgeGroup(data[2])
            .setBrand(data[3])
            .setMaterial(data[4])
            .setBatteryRequired(data[5] === 'true') // Assuming boolean is represented as 'true'/'false'
            .setEducational(data[6] === 'true') // Assuming boolean is represented as 'true'/'false'
            .build();
    }
}
exports.XMLToyMapper = XMLToyMapper;
class PostgreToyMapper {
    map(data) {
        return toy_builder_1.IdentifierToyBuilder.newBuilder()
            .setid(data.id)
            .setToy(toy_builder_1.ToyBuilder.newBuilder()
            .setAgeGroup(data.ageGroup)
            .setBatteryRequired(data.batteryRequired)
            .setBrand(data.brand).setEducational(data.educational)
            .setMaterial(data.material).setType(data.type)
            .build())
            .build();
    }
    reverseMap() {
        throw new Error('Method not implemented.');
    }
}
exports.PostgreToyMapper = PostgreToyMapper;
//# sourceMappingURL=ToyMapper.js.map