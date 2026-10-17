using System.Buffers.Binary;
using System.Reflection.PortableExecutable;
using ThinkingHome.PackagePlanning;
using Xunit;

namespace ThinkingHome.Packaging.Tests;

public class ManagedArchitectureTests
{
    [Theory]
    [InlineData("linux-x64", 0xFD1D, 0x00525452, false, true)]
    [InlineData("win-x64", 0xFD1D, 0x00525452, false, false)]
    [InlineData("linux-x64", 0xFD1D, 0, false, false)]
    [InlineData("linux-x64", 0xAA64, 0x00525452, false, false)]
    [InlineData("linux-x64", 0x014C, 0, true, false)]
    public void ManagedImage_ChecksArchitectureAndReadyToRunHeader(string rid, int machine,
        uint signature, bool requires32Bit, bool accepted)
    {
        var bytes = File.ReadAllBytes(typeof(ManagedArchitectureTests).Assembly.Location);
        using var pe = new PEReader(new MemoryStream(bytes));
        var headers = pe.PEHeaders;
        BinaryPrimitives.WriteUInt16LittleEndian(bytes.AsSpan(headers.CoffHeaderStartOffset), (ushort)machine);

        // Размещаем тестовый native-заголовок в конце последней секции, вне метаданных.
        var section = headers.SectionHeaders.Last();
        var offset = Math.Min(section.VirtualSize, section.SizeOfRawData) - sizeof(uint);
        BinaryPrimitives.WriteUInt32LittleEndian(bytes.AsSpan(section.PointerToRawData + offset), signature);
        var directory = headers.CorHeaderStartOffset + 64;
        BinaryPrimitives.WriteInt32LittleEndian(bytes.AsSpan(directory), section.VirtualAddress + offset);
        BinaryPrimitives.WriteInt32LittleEndian(bytes.AsSpan(directory + 4), 4);

        if (requires32Bit)
        {
            var flags = headers.CorHeader!.Flags | CorFlags.Requires32Bit;
            BinaryPrimitives.WriteInt32LittleEndian(bytes.AsSpan(headers.CorHeaderStartOffset + 16), (int)flags);
        }

        if (accepted)
            PlanBuilder.CheckManaged(bytes, "test.dll", rid);
        else
            Assert.Throws<ResolutionException>(() => PlanBuilder.CheckManaged(bytes, "test.dll", rid));
    }
}
