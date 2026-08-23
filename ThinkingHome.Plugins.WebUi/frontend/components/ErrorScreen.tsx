import React from "react";
import {Center, Group, Text, Title} from "@mantine/core";

export interface ErrorScreenProps {
    message: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({message}) => {

    return (
        <Center h="100%">
            <Group gap="xs" align="baseline">
                <Title order={1} c="red">Error</Title>
                <Text c="dimmed" size="xl" style={{whiteSpace: 'nowrap'}}>{message}</Text>
            </Group>
        </Center>
    );
}
